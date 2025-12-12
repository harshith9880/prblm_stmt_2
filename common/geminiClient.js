import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function chatCompletion(messages) {
  let prompt = "";

  for (const m of messages) {
    prompt += `${m.role.toUpperCase()}: ${m.content}\n\n`;
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_LLM_MODEL || "gemini-2.5-flash-lite",
  });

  const response = await model.generateContent(prompt);
  return response.response.text();
}

// prevent accidental embedding usage
export function embedText() {
  throw new Error("❌ embedText disabled — BERT embeddings must be used instead.");
}
