import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, BillingProposal } from "../../common/db.js";
import optimizeCost from "./optimizer.js";

await connectDB(process.env.MONGO_URI);

new Worker("billing", async job => {
  console.log("[Billing] job:", job.id, job.data);

  const result = optimizeCost(job.data);

  await BillingProposal.create({
    patientId: job.data.patientId,
    input: job.data,
    proposal: result
  });

  return result;
}, { connection: redisConnection });

console.log("Billing agent ready.");
