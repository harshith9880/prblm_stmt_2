import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPatientDetails } from "../api/patientApi";
import { logAccess } from "../api/securityApi";
import DiagnosticsPanel from "../components/DiagnosticsPanel";
import BillingPanel from "../components/BillingPanel";

export default function PatientPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const load = async () => {
    await logAccess({
      actor: "doctor_1",
      action: "view",
      resourceId: id,
      resourceType: "patient"
    });

    const { data } = await getPatientDetails(id);
    setData(data);
  };

  useEffect(() => { load(); }, []);

  if (!data) return <p>Loading...</p>;

  const { patient, documents } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{patient.name}</h1>
      <p>Age: {patient.age}</p>
      <p className="mb-3">Summary: {patient.summary}</p>

      <h2 className="text-lg font-bold mt-4">Documents</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm">
{documents.map(d => d.text).join("\n---\n")}
      </pre>

      <DiagnosticsPanel patientId={id} />
      <BillingPanel patientId={id} />
    </div>
  );
}
