import { embedTextBERT } from "../../common/bertEmbedder.js";

export async function embedChunks(chunks) {
  const vectors = [];

  for (const text of chunks) {
    try {
      const vec = await embedTextBERT(text);
      console.log("[RAG] Chunk embedded. Dim:", vec.length);
      vectors.push(vec);
    } catch (err) {
      console.error("[RAG] BERT embedding error:", err);

      // BERT output = 768 dims ALWAYS
      vectors.push(new Array(768).fill(0));
    }
  }

  return vectors;
}
