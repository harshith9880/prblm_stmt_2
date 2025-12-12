import mongoose from "mongoose";

const diagnosticSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  question: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed }, // JSON from LLM
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Diagnostic", diagnosticSchema);
