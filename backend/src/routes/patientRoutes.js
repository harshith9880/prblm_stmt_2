import express from "express";
import { getPatientDetails, listPatients } from "../controllers/patientController.js";

const router = express.Router();
router.get("/", listPatients);
router.get("/:id", getPatientDetails);

export default router;
