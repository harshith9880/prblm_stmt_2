import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  text: String,
  source: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", documentSchema);
