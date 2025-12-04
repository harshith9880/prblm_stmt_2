// backend/src/queues/redisQueues.js
import { Queue } from "bullmq";
import { redisConnection } from "../../../common/redisConnection.js"; // <- shared common folder

export const intakeQueue = new Queue("intake", { connection: redisConnection });
export const ragQueue = new Queue("rag", { connection: redisConnection });
export const diagnosticsQueue = new Queue("diagnostics", { connection: redisConnection });
export const billingQueue = new Queue("billing", { connection: redisConnection });
export const securityQueue = new Queue("security", { connection: redisConnection });

export { redisConnection };
