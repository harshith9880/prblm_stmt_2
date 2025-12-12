import "dotenv/config";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { connectDB } from "../../common/db.js";

import intakeRoutes from "./routes/intakeRoutes.js";
import diagnosticsRoutes from "./routes/diagnosticsRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB(process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// ROUTES
app.use("/api/intake", intakeRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Hospital AI Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
