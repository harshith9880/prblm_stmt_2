import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();

  const handleLogin = () => {
    nav("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-3 rounded text-xl">
        Enter Hospital System
      </button>
    </div>
  );
}
