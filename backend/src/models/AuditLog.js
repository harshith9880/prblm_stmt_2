import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  actor: String,
  action: String,
  resourceId: String,
  resourceType: String,
  timestamp: { type: Date, default: Date.now },
  meta: Object
});

export default mongoose.model("AuditLog", auditSchema);
