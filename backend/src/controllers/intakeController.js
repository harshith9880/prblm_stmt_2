import Patient from "../models/Patient.js";
import Document from "../models/Document.js";
import { intakeQueue } from "../queues/redisQueues.js";
import { fileToBase64 } from "../utils/upload.js";

export const patientIntake = async (req, res) => {
  try {
    const { name, age } = req.body;
    const file = req.files?.file;

    const base64 = file ? fileToBase64(file) : null;

    // Create patient skeleton
    const patient = await Patient.create({ name, age });

    // Store raw document (for viewing later)
    await Document.create({
      patientId: patient._id,
      text: file ? file.data.toString("utf8") : "",
      source: "upload"
    });

    // Add to Intake Agent
    await intakeQueue.add("intake", {
      name,
      age,
      patientId: patient._id.toString(),
      base64File: base64
    });

    res.json({ success: true, patientId: patient._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Intake failed" });
  }
};
