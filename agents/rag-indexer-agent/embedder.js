import { embedText } from "../../common/geminiClient.js";

/**
 * embedChunks: given array of strings, returns array of vectors
 */
export async function embedChunks(chunks) {
  const vecs = [];
  for (let c of chunks) {
    try {
      const v = await embedText(c);
      vecs.push(v);
    } catch (err) {
      console.error("[embedChunks] OpenAI error:", err);
      // on error push zero vector fallback
      vecs.push(new Array(1536).fill(0));
    }
  }
  return vecs;
}
