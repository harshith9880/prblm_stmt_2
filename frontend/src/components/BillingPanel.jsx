import { useState } from "react";
import { optimizeBilling } from "../api/billingApi";

export default function BillingPanel({ patientId }) {
  const [treatments, setTreatments] = useState([
    { id: "t1", name: "MRI Scan", cost: 2000, alternatives: [{ id: "t1a", name: "CT Scan", cost: 800 }] },
    { id: "t2", name: "Blood Test", cost: 300, alternatives: [] }
  ]);

  const runBilling = async () => {
    await optimizeBilling({ patientId, treatments });
    alert("Billing optimization queued!");
  };

  return (
    <div className="bg-white p-5 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-3">Billing Optimization</h2>

      <pre className="bg-gray-100 p-3 rounded text-sm">
{JSON.stringify(treatments, null, 2)}
      </pre>

      <button onClick={runBilling}
        className="bg-purple-600 text-white px-4 py-2 rounded mt-3">
        Optimize Billing
      </button>
    </div>
  );
}
