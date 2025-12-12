import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => res.send("Hospital AI Backend Running"));

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Wait for DB connection
  await connectDB();
  
  // Give MongoDB a moment to be fully ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // NOW import routes (which import models)
  const { default: intakeRoutes } = await import("./routes/intakeRoutes.js");
  const { default: diagnosticsRoutes } = await import("./routes/diagnosticsRoutes.js");
  const { default: billingRoutes } = await import("./routes/billingRoutes.js");
  const { default: patientRoutes } = await import("./routes/patientRoutes.js");
  const { default: securityRoutes } = await import("./routes/securityRoutes.js");
  
  // Register routes AFTER DB is ready
  app.use("/api/intake", intakeRoutes);
  app.use("/api/diagnostics", diagnosticsRoutes);
  app.use("/api/billing", billingRoutes);
  app.use("/api/patients", patientRoutes);
  app.use("/api/security", securityRoutes);
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:5001`);
    console.log(`✅ All routes registered and ready`);
  });
};

startServer().catch(err => {
  console.error("❌ Server startup failed:", err);
  process.exit(1);
});
