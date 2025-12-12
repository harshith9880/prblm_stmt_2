import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Embedding, Diagnostic } from "../../common/db.js";

import { embedTextBERT } from "../../common/bertEmbedder.js";
import { topKSearch } from "../../common/vecUtils.js";
import { chatCompletion } from "../../common/geminiClient.js";   // LLM ONLY

await connectDB(process.env.MONGO_URI);

console.log("[DiagnosticsAgent] Started. Listening on diagnostics queue.");

new Worker(
  "diagnostics",
  async job => {
    console.log("\n========================================");
    console.log("[DiagnosticsAgent] New Job:", job.id);
    console.log(job.data);
    console.log("========================================\n");

    const { patientId, question } = job.data;

    // ---------------------------
    // 1) EMBED THE QUERY
    // ---------------------------
    console.log("[Diagnostics] Embedding question...");

    let qvec;
    try {
      qvec = await embedTextBERT(question);
      console.log("[Diagnostics] ✔ Query embedding size:", qvec.length);
    } catch (err) {
      console.error("[Diagnostics] ❌ Query embedding FAILED:", err);
      return await Diagnostic.create({
        patientId,
        question,
        result: { error: "embedding_failed" }
      });
    }

    // ---------------------------
    // 2) FETCH PATIENT EMBEDDINGS
    // ---------------------------
    console.log("[Diagnostics] Fetching patient embeddings from DB...");

    const embDocs = await Embedding.find({ patientId }).lean();
    console.log("[Diagnostics] ✔ Chunks found:", embDocs.length);

    if (embDocs.length === 0) {
      console.warn("[Diagnostics] ❌ No RAG embeddings exist for this patient.");
      return await Diagnostic.create({
        patientId,
        question,
        result: { error: "no_embeddings_for_patient" }
      });
    }

    console.log("[Diagnostics] Example embedding dim:", embDocs[0].vector.length);

    // ---------------------------
    // 3) RUN TOP-K SEARCH
    // ---------------------------
    console.log("[Diagnostics] Running top-K similarity search...");

    const K = Number(process.env.TOP_K || 6);

    let topMatches;
    try {
      topMatches = topKSearch(embDocs, qvec, K);
      console.log("[Diagnostics] ✔ Top matches:", topMatches.length);
    } catch (err) {
      console.error("[Diagnostics] ❌ Similarity search FAILED:", err);
      return await Diagnostic.create({
        patientId,
        question,
        result: { error: "similarity_search_failed" }
      });
    }

    // ---------------------------
    // 4) BUILD CONTEXT BLOCK
    // ---------------------------
    const context = topMatches
      .map(
        (m, i) =>
          `-- CHUNK ${i + 1} (score=${m.score.toFixed(
            3
          )}) [${m.item.chunkId}]\n${m.item.text}`
      )
      .join("\n\n");

    console.log("[Diagnostics] ✔ Context built.");

    // ---------------------------
    // 5) CALL GEMINI LLM FOR REASONING
    // ---------------------------
    console.log("[Diagnostics] Calling Gemini LLM...");

    const messages = [
  {
    role: "system",
    content:
      "You are an AI assistant inside a simulated hospital environment. " +
      "The user may ask ANY type of question (medical or non-medical). " +
      "Use the provided context when relevant. If context is missing or not useful, " +
      "still produce a meaningful and safe answer. " +
      "ALWAYS return JSON with the following fields:\n" +
      "- answer: a clear answer to the question\n" +
      "- evidence: an array of chunkIds used (or empty array)\n" +
      "- confidence: low | medium | high"
  },
  {
    role: 'user',
    content:
`Patient Context:
${context}

Question: ${question}

Return ONLY JSON in this format:
{
  "answer": "your explanation or reasoning here",
  "evidence": ["chunkId1", "chunkId2"],
  "confidence": "low|medium|high"
}`
  }
];

    let llmText;
    try {
      llmText = await chatCompletion(messages);
    } catch (err) {
      console.error("[Diagnostics] ❌ LLM ERROR:", err);
      return await Diagnostic.create({
        patientId,
        question,
        result: { error: "llm_failed" }
      });
    }

    console.log("[Diagnostics] ✔ Raw LLM output:");
    console.log(llmText);

    // ---------------------------
    // 6) PARSE JSON SAFELY
    // ---------------------------
    let parsed;
    try {
      parsed = JSON.parse(
        llmText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
    } catch (err) {
      console.error("[Diagnostics] ❌ JSON PARSE ERROR:", err);
      parsed = { raw: llmText, error: "json_parse_failed" };
    }

    // ---------------------------
    // 7) SAVE RESULT
    // ---------------------------
    console.log("[Diagnostics] ✔ Saving diagnostic result...");

    const saved = await Diagnostic.create({
      patientId,
      question,
      result: parsed
    });

    console.log("[DiagnosticsAgent] ✔ Diagnostic saved:", saved._id);

    return parsed;
  },
  {
    connection: redisConnection
  }
);