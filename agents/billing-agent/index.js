import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../common/redisConnection.js";
import { connectDB, BillingProposal } from "../../common/db.js";
import optimizeCost from "./optimizer.js";

await connectDB(process.env.MONGO_URI);

new Worker("billing", async job => {
  console.log("[BillingAgent] job:", job.id, job.data);
  // job.data expected: { patientId, treatments: [ { id, name, cost, alternatives: [{id,name,cost}] } ], constraints }
  const result = await optimizeCost(job.data);
  await BillingProposal.create({ patientId: job.data.patientId, input: job.data, proposal: result });
  return result;
},
{
    connection: redisConnection,
  });

console.log("Billing agent listening to 'billing' queue");
