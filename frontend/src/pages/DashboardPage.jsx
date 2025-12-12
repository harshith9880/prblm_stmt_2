import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../api/patientApi";
import IntakeForm from "../components/IntakeForm";
import PatientCard from "../components/PatientCard";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const nav = useNavigate();

  const refresh = async () => {
    const { data } = await getPatients();
    setPatients(data);
  };

  useEffect(() => { refresh(); }, []);

  const logout = () => {
    localStorage.removeItem("token");   // remove auth token
    nav("/");                           // redirect to login
  };

  return (
    <div className="p-6">

      {/* Header Row with Logout */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Hospital Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>

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
