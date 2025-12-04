import { useState } from "react";
import { createIntake } from "../api/patientApi";

export default function IntakeForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", age: "" });
  const [file, setFile] = useState(null);

  const submitIntake = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("age", form.age);
    if (file) fd.append("file", file);

    await createIntake(fd);
    onSuccess();
  };

  return (
    <form onSubmit={submitIntake} className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">New Patient Intake</h2>

      <input className="border p-2 w-full mb-3"
        placeholder="Patient Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input className="border p-2 w-full mb-3"
        placeholder="Age"
        type="number"
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />

      <input type="file"
        className="border p-2 w-full mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Submit
      </button>
    </form>
  );
}
