import { Link } from "react-router-dom";

export default function PatientCard({ p }) {
  return (
    <Link to={`/patient/${p._id}`}>
      <div className="bg-white p-4 shadow rounded hover:bg-blue-50 cursor-pointer">
        <h2 className="text-lg font-bold">{p.name}</h2>
        <p>Age: {p.age}</p>
      </div>
    </Link>
  );
}
