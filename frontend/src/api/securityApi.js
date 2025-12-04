import axios from "axios";
const API = "http://localhost:5001/api";

export const logAccess = (data) =>
  axios.post(`${API}/security/log`, data);

export const getAuditLogs = () =>
  axios.get(`${API}/security/logs`);
