import Patient from "../models/Patient.js";
import Document from "../models/Document.js";
import { intakeQueue } from "../queues/redisQueues.js";
import { fileToBase64 } from "../utils/upload.js";

export const patientIntake = async (req, res) => {
  try {
    const { name, age } = req.body;
    const file = req.files?.file;

    // Extract raw text from uploaded file
    const rawText = file ? file.data.toString("utf8") : "";

    // Convert file to base64 (optional)
    const base64 = file ? fileToBase64(file) : null;

    // Create patient shell
    const patient = await Patient.create({ name, age });

    // Save uploaded document to database
    await Document.create({
      patientId: patient._id,
      text: rawText,
      source: "upload",
    });

    // Send full text to intake agent
    await intakeQueue.add("intake", {
      name,
      age,
      patientId: patient._id.toString(),
      rawText,       // 🔥 IMPORTANT: send text for RAG
      base64File: base64,
    });

    res.json({ success: true, patientId: patient._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Intake failed" });
  }
};
