import axios from "axios";
const API = "http://localhost:5000/api";

export const createIntake = (formData) =>
  axios.post(`${API}/intake`, formData);

export const getPatients = () =>
  axios.get(`${API}/patients`);

export const getPatientDetails = (id) =>
  axios.get(`${API}/patients/${id}`);
