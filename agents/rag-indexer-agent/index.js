import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Embedding } from "../../common/db.js";
import { chunkText } from "./chunker.js";
import { embedChunks } from "./embedder.js";

await connectDB(process.env.MONGO_URI);

new Worker("rag", async job => {
  console.log("[RAG Indexer] job:", job.id, job.name, job.data);
  // job.data expected { patientId, docId, text }
  const { patientId, docId, text } = job.data;
  // chunk
  const chunks = chunkText(text, { size: 700, overlap: 100 });
  // embed chunks
  const vectors = await embedChunks(chunks);
  // store each chunk + vector
  const stores = vectors.map((v, i) => ({
    patientId,
    docId,
    chunkId: `${docId}::${i}`,
    text: chunks[i],
    vector: v
  }));
  // bulk insert
  await Embedding.insertMany(stores);
  console.log(`[RAG Indexer] indexed ${stores.length} chunks for doc ${docId}`);
  return { indexed: stores.length };
},
{
    connection: redisConnection,
  });

console.log("RAG Indexer running and listening to 'rag' queue");
