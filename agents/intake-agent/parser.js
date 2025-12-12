import { chatCompletion } from "../../common/geminiClient.js";
import { Patient } from "../../common/db.js";

export async function parseIntake({ patientId, text }) {
  const messages = [
    {
      role: "system",
      content:
        "Extract structured medical fields. Return JSON with: allergies, medications, past_conditions, vitals, chief_complaint, short_summary."
    },
    {
      role: "user",
      content: `${text}\n\nReturn JSON only.`
    }
  ];

  try {
    const raw = await chatCompletion(messages);

    const cleaned = raw.trim().replace(/```json|```/g, "").trim();
    let parsed = {};

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { short_summary: raw.slice(0, 120) };
    }

    await Patient.findByIdAndUpdate(patientId, {
      summary: parsed.short_summary || JSON.stringify(parsed)
    });

    return parsed.short_summary || JSON.stringify(parsed);
  } catch (err) {
    console.error("[parseIntake] Error:", err);
    return null;
  }
}
