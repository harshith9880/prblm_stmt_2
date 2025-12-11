import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Embedding, Diagnostic, Document } from "../../common/db.js";
import { embedText, chatCompletion } from "../../common/geminiClient.js";
import { topKSearch } from "../../common/vecUtils.js";

await connectDB(process.env.MONGO_URI);

new Worker("diagnostics", async job => {
  console.log("[DiagnosticsAgent] job:", job.id, job.data);
  // job.data expected: { patientId, question }
  const { patientId, question } = job.data;
  // 1) embed query
  const qvec = await embedText(question);

  // 2) fetch embeddings for patient
  const embDocs = await Embedding.find({ patientId }).lean().exec(); // array with vectors
  if (!embDocs || embDocs.length === 0) {
    console.warn("[DiagnosticsAgent] No embeddings found for patient", patientId);
    return await Diagnostic.create({ patientId, question, result: { error: "no_context" }});
  }

  // 3) topK search in memory using cosineSim
  const k = Number(process.env.TOP_K || 6);
  const top = topKSearch(embDocs, qvec, k);

  // 4) build context text
  let context = top.map((t, idx) => `-- CHUNK ${idx+1} (score=${t.score.toFixed(3)}):\n${t.item.text}\n[chunkId:${t.item.chunkId}]`).join("\n\n");

  // 5) call LLM with constrained prompt & provenance requirement
  const messages = [
    { role: "system", content: "You are a diagnostic assistant for a simulated hospital. Use ONLY the provided context. Do NOT hallucinate." },
    { role: "user", content: `Patient context:\n${context}\n\nQuestion: ${question}\n\nReturn:\n1) A short list (<=5) of differential diagnoses with 1-line rationale each referencing the chunkId(s) used.\n2) Suggested next tests (max 3) with urgency.\n3) Confidence (low/medium/high).\nReturn JSON only.` }
  ];

  const assistantText = await chatCompletion(messages);
  let parsed;
  try { parsed = JSON.parse(assistantText); } catch (e) {
    parsed = { raw: assistantText };
  }

  const doc = await Diagnostic.create({ patientId, question, result: parsed });
  console.log("[DiagnosticsAgent] saved diagnostic:", doc._id);
  return parsed;
},
{
    connection: redisConnection,
  });

console.log("Diagnostics agent listening to 'diagnostics' queue");
