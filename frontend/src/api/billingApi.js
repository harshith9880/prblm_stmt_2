import axios from "axios";
const API = "http://localhost:5000/api";

export const optimizeBilling = (data) =>
  axios.post(`${API}/billing`, data);
