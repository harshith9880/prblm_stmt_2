import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Patient, Document } from "../../common/db.js";
import { parseIntake } from "./parser.js";
import { Queue } from "bullmq";

await connectDB(process.env.MONGO_URI);

const ragQueue = new Queue("rag", { connection: redisConnection });

new Worker(
  "intake",
  async (job) => {
    console.log("[IntakeAgent] job:", job.id, job.data);

    const { name, age, base64File, rawText, patientId: incomingPatientId } = job.data;

    let patient;

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
      patient = await Patient.create({
        name,
        age,
        pseudonym: `P-${Date.now()}`,
      });

      console.log("[IntakeAgent] Created NEW patient:", patient._id);
    }

    let text = "";
    if (rawText) text = rawText;
    else if (base64File) text = Buffer.from(base64File, "base64").toString("utf8");

    if (text && text.trim()) {
      console.log(`[IntakeAgent] Document text length: ${text.length}`);
      
      const doc = await Document.create({
        patientId: patient._id.toString(),
        text,
        source: "intake-upload",
      });

      console.log(`[IntakeAgent] Document saved: ${doc._id}`);

      const summary = await parseIntake({
        patientId: patient._id.toString(),
        text,
      });

      await Patient.findByIdAndUpdate(patient._id, {
        summary: summary || "",
      });

      // ✅ FIXED: Use ragQueue directly
      console.log(`[IntakeAgent] Sending to RAG queue...`);
      
      await ragQueue.add("index-doc", {
        patientId: patient._id.toString(),
        docId: doc._id.toString(),
        text,
      });

      console.log(`[IntakeAgent] ✔ Sent to RAG indexer`);
    } else {
      console.log(`[IntakeAgent] ⚠️ No text found (rawText length: ${rawText?.length || 0})`);
    }

    console.log(`[IntakeAgent] Completed intake for patient ${patient._id}`);
    return { patientId: patient._id.toString() };
  },
  { connection: redisConnection }
);

console.log("Intake agent listening to 'intake' queue");
