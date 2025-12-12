import { Audit } from "../../common/db.js";

export async function detectAnomaly(event) {
  const { actor, resourceId, timestamp } = event;

  const hour = new Date(timestamp).getHours();
  if (hour >= 0 && hour <= 5) {
    return {
      reason: "odd_hour_access",
      detail: event
    };
  }

  const since = new Date(Date.now() - 60_000);

  const prior = await Audit.find({
    actor,
    resourceType: "patient",
    timestamp: { $gte: since }
  });

  const unique = new Set(prior.map(a => a.resourceId));
  unique.add(resourceId);

  if (unique.size >= 5) {
    return {
      reason: "suspicious_rapid_access",
      count: unique.size,
      detail: event
    };
  }

  return null;
}
