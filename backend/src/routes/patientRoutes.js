import express from "express";
import { getPatientDetails, listPatients, getPatientDocuments } from "../controllers/patientController.js";

const router = express.Router();
router.get("/", listPatients);
router.get("/:id", getPatientDetails);
router.get("/:id/documents", getPatientDocuments);

export default router;
