import { Queue } from "bullmq";
export const billingQueue = new Queue("billing", {
  connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
});
