import express from "express";
import { getAllDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile } from "../controllers/doctor.controller.js";
import { VerifyJWT } from "../middleware/user.middleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/me", VerifyJWT, getDoctorProfile);
router.put("/me", VerifyJWT, updateDoctorProfile);
router.get("/:id", getDoctorById);

export default router;
