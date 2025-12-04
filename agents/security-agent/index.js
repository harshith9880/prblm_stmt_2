import "dotenv/config";
import { Worker } from "bullmq";
import { connectDB, Audit } from "../../common/db.js";
import { redisConnection } from "../../common/redisConnection.js";
import { detectAnomaly } from "./detector.js";

await connectDB(process.env.MONGO_URI);

// This worker listens to 'security' queue for new accesses (or alternatively watches the Audit collection).
new Worker("security", async job => {
  // job.data expected: { actor, action, resourceType, resourceId, timestamp }
  console.log("[SecurityAgent] job:", job.data);
  await Audit.create(job.data); // store audit
  const alert = await detectAnomaly(job.data);
  if (alert) {
    // For hackathon just log & store as audit of type alert
    console.warn("[SecurityAgent] ALERT:", alert);
    await Audit.create({ actor: "system", action: "alert", resourceType: "security", resourceId: job.data.resourceId, meta: alert });
    // (Optionally) push notification / email / UI socket here
  }
  return { ok: true };
},
{
    connection: redisConnection,
  });

console.log("Security agent listening to 'security' queue");
