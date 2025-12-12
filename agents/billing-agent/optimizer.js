export default function optimizeCost({ treatments = [], constraints = {} }) {
  const doNotReplace = constraints.doNotReplace || [];

  let total = 0;
  const lineItems = [];

  for (const t of treatments) {
    if (doNotReplace.includes(t.id) || !t.alternatives?.length) {
      lineItems.push({ chosen: t, note: "original" });
      total += t.cost;
      continue;
    }

    const candidates = [
      { ...t, origin: "original" },
      ...t.alternatives.map(a => ({ ...a, origin: "alt" }))
    ];

    candidates.sort((a, b) => a.cost - b.cost);

    const chosen = candidates[0];
    lineItems.push({ chosen, note: chosen.origin });
    total += chosen.cost;
  }

  const discount = Math.round(total * 0.03);
  return {
    totalBefore: total,
    discount,
    totalAfter: total - discount,
    lineItems
  };
}