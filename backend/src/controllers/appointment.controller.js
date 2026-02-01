import { Appointment } from "../models/appointment.models.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, time } = req.body;
    const userId = req.user.id;

    if (!doctorId || !date || !time) {
        throw new ApiError(400, "All fields are required");
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
        throw new ApiError(404, "Doctor not found");
    }

    const appointment = await Appointment.create({
        userId,
        doctorId,
        date,
        time
    });

    return res.status(201).json(new ApiResponse(200, appointment, "Appointment created successfully"));
});

export const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
        $or: [
            { userId: req.user.id },
            { doctorId: req.user.id }
        ]
    })
        .populate("userId", "name email")
        .populate("doctorId", "name email specialization");

    return res.status(200).json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

export const getAppointmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
        .populate("userId", "name email")
        .populate("doctorId", "name email specialization");

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.userId._id.toString() !== req.user.id && appointment.doctorId._id.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to access this appointment");
    }

    return res.status(200).json(new ApiResponse(200, appointment, "Appointment fetched successfully"));
});

export const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.userId._id.toString() !== req.user.id && appointment.doctorId._id.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to update this appointment");
    }

    if (status) appointment.status = status;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    return res.status(200).json(new ApiResponse(200, appointment, "Appointment updated successfully"));
});

export const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.userId._id.toString() !== req.user.id && appointment.doctorId._id.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to delete this appointment");
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "Appointment deleted successfully"));
});