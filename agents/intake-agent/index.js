import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Patient, Document } from "../../common/db.js";
import { parseIntake } from "./parser.js";

await connectDB(process.env.MONGO_URI);

new Worker("intake", async job => {
  console.log("[IntakeAgent] job received:", job.id, job.data);
  // job.data expected: { name, age, base64File (optional), rawText (optional) }
  const { name, age, base64File, rawText } = job.data;
  const patient = await Patient.create({ name, age, pseudonym: `P-${Date.now()}` });

  // save original document (if any)
  if (base64File || rawText) {
    const txt = rawText ? rawText : Buffer.from(base64File, "base64").toString("utf8");
    const doc = await Document.create({ patientId: patient._id, originalText: txt, source: "intake-upload" });

    // parse and attach summary
    const summary = await parseIntake({ patientId: patient._id.toString(), text: txt });
    patient.summary = summary || "";
    await patient.save();

    // push to RAG queue to index
    import("../queues/ragQueue.js").then(mod => {
      mod.ragQueue.add("index-doc", { patientId: patient._id.toString(), docId: doc._id.toString(), text: txt });
    });
  }

  // Log audit (you can expand this)
  console.log(`[IntakeAgent] Created patient ${patient._id}`);
  return { patientId: patient._id.toString() };
},
{
    connection: redisConnection,
  });

console.log("Intake agent running and listening to 'intake' queue");
