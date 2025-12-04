import { useState } from "react";
import { runDiagnostics } from "../api/diagnosticsApi";

export default function DiagnosticsPanel({ patientId }) {
  const [question, setQuestion] = useState("");

  const handleRun = async () => {
    await runDiagnostics({ patientId, question });
    alert("Diagnostics request sent!");
  };

  return (
    <div className="bg-white p-5 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-3">Diagnostics</h2>
      <textarea
        className="border p-2 w-full"
        rows="3"
        placeholder="Ask a diagnostic question..."
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleRun} className="bg-green-600 text-white px-4 py-2 rounded mt-3">
        Run Diagnostics
      </button>
    </div>
  );
}
