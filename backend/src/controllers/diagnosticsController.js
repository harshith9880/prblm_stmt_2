import { diagnosticsQueue } from "../queues/redisQueues.js";

export const runDiagnostics = async (req, res) => {
  try {
    const { patientId, question } = req.body;

    await diagnosticsQueue.add("diagnose", { patientId, question });

    res.json({ queued: true, patientId, question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "diagnostics_failed" });
  }
};
