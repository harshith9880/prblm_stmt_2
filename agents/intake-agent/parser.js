import { embedText, chatCompletion } from "../../common/geminiClient.js";
import { Document, Patient } from "../../common/db.js";

/**
 * parseIntake: uses LLM to extract structured fields from intake text
 * Returns a short summary string to be attached to patient.summary
 */
export async function parseIntake({ patientId, text }) {
  // Simple prompt to extract high-level summary + past conditions / meds
  const messages = [
    { role: "system", content: "You are a structured extractor. Return a short JSON with fields: allergies, medications, past_conditions, vitals (if present), chief_complaint, short_summary." },
    { role: "user", content: `Here is intake text:\n\n${text}\n\nReturn JSON only.` }
  ];

  try {
    const raw = await chatCompletion(messages);
    // some LLMs produce code block - try to parse JSON out
    const jsonString = raw.trim().replace(/^[`]*json[`]*\s*/, "").trim();
    let parsed;
    try { parsed = JSON.parse(jsonString); }
    catch (e) {
      // fallback - make a small summary
      parsed = { short_summary: raw.slice(0, 100) };
    }

    // attach summary to patient doc (best-effort)
    await Patient.findByIdAndUpdate(patientId, { summary: parsed.short_summary || JSON.stringify(parsed) });

    return parsed.short_summary || JSON.stringify(parsed);
  } catch (err) {
    console.error("[parseIntake] Error:", err);
    return null;
  }
}
