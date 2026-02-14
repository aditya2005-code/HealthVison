import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createTimeslot, getTimeslots } from "../controllers/timeslot.controller.js";

const router = express.Router();

// Create a timeslot (Protected)
router.post("/:doctorId", protect, createTimeslot);

// Get timeslots for a doctor
router.get("/:doctorId", protect, getTimeslots);

export default router;