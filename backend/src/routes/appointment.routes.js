import express from "express";
import { VerifyJWT } from "../middleware/user.middleware.js";
import { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", VerifyJWT, createAppointment);
router.get("/", VerifyJWT, getAppointments);
router.get("/:id", VerifyJWT, getAppointmentById);
router.put("/:id", VerifyJWT, updateAppointment);
router.delete("/:id", VerifyJWT, deleteAppointment);
export default router;