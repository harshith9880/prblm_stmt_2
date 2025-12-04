export function chunkText(text, { size = 500, overlap = 50 } = {}) {
  // naive chunker by characters (works fine for hackathon)
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const part = text.slice(i, i + size);
    chunks.push(part);
    i += size - overlap;
  }
  return chunks;
}
