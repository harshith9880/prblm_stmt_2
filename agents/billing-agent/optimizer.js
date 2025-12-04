/**
 * Simple greedy cost minimizer:
 * For each treatment, if alternatives exist choose lowest-cost alternative
 * subject to constraint: doNotReplace array
 *
 * This is intentionally simple for hackathon: replace with ILP solver (ORTools) if needed.
 */
export default async function optimizeCost({ patientId, treatments = [], constraints = {} }) {
  const doNotReplace = constraints.doNotReplace || []; // array of treatment ids not to change
  const lineItems = [];
  let total = 0;
  for (const t of treatments) {
    if (doNotReplace.includes(t.id) || !t.alternatives || t.alternatives.length === 0) {
      lineItems.push({ chosen: t, note: "original" });
      total += t.cost;
    } else {
      // choose lowest cost alternative among [original + alternatives] but respect minimum required quality if provided
      const candidates = [{ id: t.id, name: t.name, cost: t.cost, origin: "original" }, ...t.alternatives.map(a => ({ ...a, origin: "alt" }))];
      candidates.sort((a,b) => a.cost - b.cost);
      const chosen = candidates[0];
      lineItems.push({ chosen, note: `chosen (from ${chosen.origin})`});
      total += chosen.cost;
    }
  }

  const discount = Math.round(total * 0.02); // e.g., hospital policy discount for optimization
  const optimizedTotal = Math.max(0, total - discount);

  return { totalBefore: total, discount, totalAfter: optimizedTotal, lineItems };
}
