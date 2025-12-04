export function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
export function norm(a) {
  return Math.sqrt(dot(a, a));
}
export function cosineSim(a, b) {
  const n = norm(a) * norm(b);
  if (n === 0) return 0;
  return dot(a, b) / n;
}

/**
 * Simple topK nearest neighbor from Mongo embeddings (in code).
 * embeddings: array of docs with .vector
 * queryVec: embedding vector
 */
export function topKSearch(embeddings, queryVec, k = 6) {
  const scored = embeddings.map(e => ({ score: cosineSim(queryVec, e.vector), item: e }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map(s => ({ score: s.score, item: s.item }));
}
