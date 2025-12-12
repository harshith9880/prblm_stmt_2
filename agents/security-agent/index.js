import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, Audit } from "../../common/db.js";
import { detectAnomaly } from "./detector.js";

await connectDB(process.env.MONGO_URI);

new Worker("security", async job => {
  console.log("[Security] job:", job.data);

  await Audit.create(job.data);

  const alert = await detectAnomaly(job.data);

  if (alert) {
    console.warn("[ALERT]", alert);
    await Audit.create({
      actor: "system",
      action: "alert",
      resourceType: "security",
      resourceId: job.data.resourceId,
      meta: alert
    });
  }

  return { ok: true };
}, { connection: redisConnection });

console.log("Security agent running.");
