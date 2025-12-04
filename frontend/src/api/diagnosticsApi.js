import axios from "axios";
const API = "http://localhost:5000/api";

export const runDiagnostics = (data) =>
  axios.post(`${API}/diagnostics`, data);
