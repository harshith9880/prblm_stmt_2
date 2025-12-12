export function chunkText(text, { size = 450, overlap = 80 } = {}) {
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    const slice = text.slice(i, i + size);
    chunks.push(slice);
    i += size - overlap;
  }

  console.log(`[RAG] Chunked into ${chunks.length} chunks`);
  return chunks;
}