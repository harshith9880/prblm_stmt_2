import { billingQueue } from "../queues/redisQueues.js";

export const optimizeBilling = async (req, res) => {
  try {
    const { patientId, treatments, constraints } = req.body;

    await billingQueue.add("optimize", {
      patientId,
      treatments,
      constraints
    });

    res.json({ queued: true });
  } catch (err) {
    res.status(500).json({ error: "billing_failed" });
  }
};
