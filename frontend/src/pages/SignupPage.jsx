import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/signup", form);
    alert("Signup successful!");
    nav("/");
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    alert("Signup failed");
  }
};

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 shadow rounded">
        <h1 className="text-xl font-bold mb-4">Create Account</h1>

        <input className="border p-2 mb-2 w-full"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={submit}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
