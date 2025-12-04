import { Queue } from "bullmq";
export const ragQueue = new Queue("rag", {
  connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
});
