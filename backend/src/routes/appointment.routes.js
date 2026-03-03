import express from "express";
import { VerifyJWT } from "../middleware/user.middleware.js";
import { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment, getTimeslotsForDoctor, cancelAppointment, rescheduleAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", VerifyJWT, createAppointment);
router.get("/", VerifyJWT, getAppointments);
router.get("/timeslots/:doctorId", VerifyJWT, getTimeslotsForDoctor);
router.get("/:id", VerifyJWT, getAppointmentById);
router.put("/:id", VerifyJWT, updateAppointment);
router.delete("/:id", VerifyJWT, deleteAppointment);
router.put('/:id/cancel', VerifyJWT, cancelAppointment);
router.put('/:id/reschedule', VerifyJWT, rescheduleAppointment);

export default router;