import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPatientDetails } from "../api/patientApi";
import { logAccess } from "../api/securityApi";
import DiagnosticsPanel from "../components/DiagnosticsPanel";
import BillingPanel from "../components/BillingPanel";

// NEW: import diagnostics API
import { getDiagnostics } from "../api/diagnosticsApi";

export default function PatientPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);   // NEW

  const load = async () => {
    // Log audit in Security Agent
    await logAccess({
      actor: "doctor_1",
      action: "view",
      resourceId: id,
      resourceType: "patient",
    });

    // Load patient + documents
    const { data } = await getPatientDetails(id);
    setData(data);

    // Load diagnostics
    const diag = await getDiagnostics(id);
    if (diag?.data?.success) {
      setDiagnostics(diag.data.results);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const { patient, documents } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{patient.name}</h1>
      <p>Age: {patient.age}</p>
      <p className="mb-3">Summary: {patient.summary}</p>

      {/* Documents */}
      <h2 className="text-lg font-bold mt-4">Documents</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {documents.map(d => d.text).join("\n---\n")}
      </pre>

      {/* NEW: Diagnostics Section */}
      <h2 className="text-lg font-bold mt-6">Diagnostics Results</h2>
      {diagnostics.length === 0 && (
        <p className="text-gray-500">No diagnostics generated yet.</p>
      )}

      {diagnostics.map((d, idx) => (
        <div
          key={d._id || idx}
          className="bg-white shadow p-4 rounded mt-3 border border-gray-200"
        >
          <p className="font-semibold">Question: {d.question}</p>

          <pre className="bg-gray-900 text-green-300 p-3 rounded mt-2 text-sm overflow-x-auto">
{JSON.stringify(d.result, null, 2)}
          </pre>

          <p className="text-xs mt-1 text-gray-500">
            {new Date(d.createdAt).toLocaleString()}
          </p>
        </div>
      ))}

      {/* Diagnostics input panel (Ask a new question) */}
      <DiagnosticsPanel patientId={id} onCompleted={load} />

      {/* Billing panel */}
      <BillingPanel patientId={id} />
    </div>
  );
}
