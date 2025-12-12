import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Embedding } from "../../common/db.js";

import { chunkText } from "./chunker.js";
import { embedChunks } from "./embedder.js";

await connectDB(process.env.MONGO_URI);

console.log("🔵 RAG Indexer Agent is running…");

new Worker(
  "rag",
  async job => {
    console.log("\n==============================");
    console.log("[RAG] New job:", job.id, job.data);
    console.log("==============================\n");

    const { patientId, docId, text } = job.data;

    // 1) Chunk text
    const chunks = chunkText(text, { size: 450, overlap: 80 });

    // 2) Embed chunks
    const vectors = await embedChunks(chunks);

    // 3) Prepare DB documents
    const items = chunks.map((chunk, i) => ({
      patientId,
      docId,
      chunkId: `${docId}::${i}`,
      text: chunk,
      vector: vectors[i]
    }));

    // 4) Insert into MongoDB
    await Embedding.insertMany(items);

    console.log(`[RAG] ✔ Indexed ${items.length} chunks for doc ${docId}\n`);

    return { indexed: items.length };
  },
  { connection: redisConnection }
);