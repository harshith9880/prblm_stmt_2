import AuditLog from "../models/AuditLog.js";
import { securityQueue } from "../queues/redisQueues.js";

export const logAccess = async (req, res) => {
  const { actor, action, resourceId, resourceType } = req.body;

  // store locally
  await AuditLog.create({ actor, action, resourceId, resourceType });

  // send to security agent
  await securityQueue.add("audit", {
    actor,
    action,
    resourceId,
    resourceType,
    timestamp: new Date()
  });

  res.json({ success: true });
};

export const listAudits = async (req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 });
  res.json(logs);
};
