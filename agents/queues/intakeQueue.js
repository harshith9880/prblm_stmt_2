import { Queue } from "bullmq";
export const intakeQueue = new Queue("intake", {
  connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
});
