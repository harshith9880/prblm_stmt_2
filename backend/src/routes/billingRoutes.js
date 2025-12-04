import express from "express";
import { optimizeBilling } from "../controllers/billingController.js";

const router = express.Router();
router.post("/", optimizeBilling);

export default router;
