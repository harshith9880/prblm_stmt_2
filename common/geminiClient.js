// common/geminiClient.js
import "dotenv/config";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------- TEXT GENERATION (ChatCompletion equivalent) ----------
export async function chatCompletion(messages) {
  // Flatten messages into a single prompt because Gemini does not support chat-history roles directly
  let prompt = "";
  for (const m of messages) {
    prompt += `${m.role.toUpperCase()}: ${m.content}\n\n`;
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_LLM_MODEL || "gemini-1.5-pro",
  });

  const response = await model.generateContent(prompt);
  return response.response.text();
}

// -------- EMBEDDINGS (OpenAI embeds → Gemini embeds) ----------
export async function embedText(text) {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_EMBED_MODEL || "text-embedding-004"
  });

  const embedding = await model.embedContent(text);
  return embedding.embedding.values; // returns vector array
}
