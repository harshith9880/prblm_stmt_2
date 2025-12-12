import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);


      localStorage.setItem("token", res.data.token);
      nav("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Login</h2>

        <input className="border p-2 w-full mb-3"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleLogin}
          className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>

        <button
          className="text-blue-700 underline mt-3 w-full"
          onClick={() => nav("/signup")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
