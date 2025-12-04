import { Queue } from "bullmq";
export const diagnosticsQueue = new Queue("diagnostics", {
  connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
});
