import axios from "axios";
const API = "http://localhost:5000/api";

export const signup = (data) =>
  axios.post(`${API}/auth/signup`, data);