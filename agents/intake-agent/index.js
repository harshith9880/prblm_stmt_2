import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Patient, Document } from "../../common/db.js";
import { parseIntake } from "./parser.js";

await connectDB(process.env.MONGO_URI);

new Worker(
  "intake",
  async (job) => {
    console.log("[IntakeAgent] job:", job.id, job.data);

    const { name, age, base64File, rawText, patientId: incomingPatientId } = job.data;

    let patient;

    // ---------------------------------------------------------
    // 1️⃣ Always use the backend-created patient if provided
    // ---------------------------------------------------------
    if (incomingPatientId) {
      patient = await Patient.findById(incomingPatientId);

      if (!patient) {
        console.error(
          "[IntakeAgent] ERROR: Backend sent patientId that does not exist:",
          incomingPatientId
        );
        throw new Error("Patient not found. Intake aborted.");
      }

      console.log("[IntakeAgent] Using existing patient:", incomingPatientId);
    } else {
      // ONLY create a patient when backend did NOT create one
      patient = await Patient.create({
        name,
        age,
        pseudonym: `P-${Date.now()}`,
      });

      console.log("[IntakeAgent] Created NEW patient:", patient._id);
    }

    // ---------------------------------------------------------
    // 2️⃣ Extract and store the text
    // ---------------------------------------------------------
    let text = "";
    if (rawText) text = rawText;
    else if (base64File) text = Buffer.from(base64File, "base64").toString("utf8");

    if (text) {
      // 🚨 IMPORTANT FIX: store in `text`, not `originalText`
      const doc = await Document.create({
        patientId: patient._id.toString(),
        text,                 // <---- FIXED
        source: "intake-upload",
      });

      // -------------------------------------------------------
      // 3️⃣ Parse intake with LLM
      // -------------------------------------------------------
      const summary = await parseIntake({
        patientId: patient._id.toString(),
        text,
      });

      await Patient.findByIdAndUpdate(patient._id, {
        summary: summary || "",
      });

      // -------------------------------------------------------
      // 4️⃣ Send to RAG Indexer
      // -------------------------------------------------------
      import("../queues/ragQueue.js").then((mod) => {
        mod.ragQueue.add("index-doc", {
          patientId: patient._id.toString(),
          docId: doc._id.toString(),
          text,
        });
      });
    }

    console.log(`[IntakeAgent] Completed intake for patient ${patient._id}`);
    return { patientId: patient._id.toString() };
  },
  { connection: redisConnection }
);

console.log("Intake agent listening to 'intake' queue");
