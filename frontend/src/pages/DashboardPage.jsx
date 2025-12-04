import { useEffect, useState } from "react";
import { getPatients } from "../api/patientApi";
import IntakeForm from "../components/IntakeForm";
import PatientCard from "../components/PatientCard";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);

  const refresh = async () => {
    const { data } = await getPatients();
    setPatients(data);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">Hospital Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <IntakeForm onSuccess={refresh} />
        </div>

        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-3">Patients</h2>
          <div className="grid grid-cols-2 gap-4">
            {patients.map((p) => <PatientCard key={p._id} p={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
