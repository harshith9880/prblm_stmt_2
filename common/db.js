import mongoose from "mongoose";

export async function connectDB(uri) {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, { autoIndex: true });
  console.log("MongoDB connected");
}

/* Schemas used by agents (simple and minimal for hackathon) */

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  pseudonym: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});
export const Patient = mongoose.model("Patient", PatientSchema);

const DocumentSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  originalText: String,
  source: String,
  createdAt: { type: Date, default: Date.now }
});
export const Document = mongoose.model("Document", DocumentSchema);

const EmbeddingSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  docId: mongoose.Schema.Types.ObjectId,
  chunkId: String,
  text: String,
  vector: [Number],
  createdAt: { type: Date, default: Date.now }
});
export const Embedding = mongoose.model("Embedding", EmbeddingSchema);

const DiagnosticsSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  question: String,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});
export const Diagnostic = mongoose.model("Diagnostic", DiagnosticsSchema);

const BillingProposalSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  input: Object,
  proposal: Object,
  createdAt: { type: Date, default: Date.now }
});
export const BillingProposal = mongoose.model("BillingProposal", BillingProposalSchema);

const AuditSchema = new mongoose.Schema({
  actor: String,
  action: String,
  resourceType: String,
  resourceId: String,
  timestamp: { type: Date, default: Date.now },
  meta: Object
});
export const Audit = mongoose.model("Audit", AuditSchema);

const UserSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  createdAt: { type: Date, default: Date.now }
});
export const User = mongoose.model("User", UserSchema);