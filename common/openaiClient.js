import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text, model = process.env.EMBEDDING_MODEL) {
  const resp = await client.embeddings.create({ model, input: text });
  return resp.data[0].embedding;
}

export async function chatCompletion(messages, model = process.env.LLM_MODEL, maxTokens = 800) {
  const resp = await client.chat.completions.create({
    model,
    messages,
    max_tokens: maxTokens
  });
  // returns assistant text (string)
  return (resp.choices?.[0]?.message?.content) ?? "";
}
