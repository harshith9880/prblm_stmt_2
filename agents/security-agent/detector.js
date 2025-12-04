/**
 * Very simple anomaly rules:
 * - Same actor accessing > N different patients within short window
 * - Access between 00:00 - 05:00 flagged (odd hours)
 *
 * For hackathon this is sufficient and easy to explain in demo.
 */
import mongoose from "mongoose";
import { Audit } from "../../common/db.js";

export async function detectAnomaly(auditEvent) {
  try {
    const { actor, action, resourceType, resourceId, timestamp } = auditEvent;
    const ts = timestamp ? new Date(timestamp) : new Date();
    const hour = ts.getHours();
    if (hour >=0 && hour <= 5) {
      return { reason: "access_at_odd_hour", hour, detail: auditEvent };
    }

    // rule: in last 1 minute actor accessed > X unique patients
    const since = new Date(Date.now() - 60_000);
    const accesses = await Audit.find({ actor, action: { $in: ["read","view","update"] }, resourceType: "patient", timestamp: { $gte: since } }).lean().exec();
    const uniquePatients = new Set(accesses.map(a => a.resourceId));
    // include current
    uniquePatients.add(resourceId);
    if (uniquePatients.size >= 5) {
      return { reason: "high_rapid_access", count: uniquePatients.size, detail: auditEvent };
    }

    // no anomaly
    return null;
  } catch (err) {
    console.error("[detector] error", err);
    return null;
  }
}
