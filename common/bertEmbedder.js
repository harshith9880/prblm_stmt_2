import { pipeline } from "@xenova/transformers";

let embedder = null;

async function loadModel() {
  if (!embedder) {
    console.log("[BERT] Loading MiniLM...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("[BERT] Loaded.");
  }
  return embedder;
}

export async function embedTextBERT(text) {
  const model = await loadModel();

  // Correct usage → returns a Tensor (1 × 384)
  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  // output.data → Float32Array length 384
  return Array.from(output.data);
}