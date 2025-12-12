import express from "express";
import { runDiagnostics, getDiagnostics } from "../controllers/diagnosticsController.js";

const router = express.Router();
router.post("/", runDiagnostics);
router.get("/patient/:patientId", getDiagnostics);

export default router;
