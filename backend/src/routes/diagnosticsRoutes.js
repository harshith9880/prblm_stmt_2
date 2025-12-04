import express from "express";
import { runDiagnostics } from "../controllers/diagnosticsController.js";

const router = express.Router();
router.post("/", runDiagnostics);

export default router;
