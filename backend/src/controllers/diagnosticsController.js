import { diagnosticsQueue } from "../queues/redisQueues.js";
import { Diagnostic } from "../../../common/db.js";

/**
 * Enqueue diagnostic request
 */
export const runDiagnostics = async (req, res) => {
  try {
    const { patientId, question } = req.body;

    // Send job to Diagnostics Agent
    await diagnosticsQueue.add("diagnose", {
      patientId,
      question,
    });

    return res.json({
      success: true,
      queued: true,
      patientId,
      question,
    });
  } catch (err) {
    console.error("[DiagnosticsController] Error:", err);
    return res.status(500).json({ error: "diagnostics_failed" });
  }
};

/**
 * Fetch all diagnostics for a patient
 */
export const getDiagnostics = async (req, res) => {
  try {
    const { patientId } = req.params;

    const results = await Diagnostic.find({ patientId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.error("[DiagnosticsController] getDiagnostics Error:", err);
    return res.status(500).json({ error: "diagnostics_fetch_failed" });
  }
};
