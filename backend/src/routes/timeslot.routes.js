import express from "express";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/:doctorId", protect, createTimeslot);
router.get("/:doctorId", protect, getTimeslots);
export default router;