import express from "express";
import { logAccess, listAudits } from "../controllers/securityController.js";

const router = express.Router();
router.post("/log", logAccess);
router.get("/logs", listAudits);

export default router;
