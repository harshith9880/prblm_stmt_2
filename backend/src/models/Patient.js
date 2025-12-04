import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  pseudonym: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", patientSchema);
