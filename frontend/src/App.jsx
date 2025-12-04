import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PatientPage from "./pages/PatientPage";
import SecurityPage from "./pages/SecurityPage";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patient/:id" element={<PatientPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Routes>
    </div>
  );
}
