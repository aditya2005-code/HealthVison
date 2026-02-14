import { Appointment } from "../models/appointment.models.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Timeslot } from "../models/timeslot.model.js";
import { sendEmail } from "../utils/sendEmail.js";

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

    // Atomic check and update to prevent race conditions
    const timeslot = await Timeslot.findOneAndUpdate(
        {
            doctorId,
            date: new Date(date),
            time,
            status: "Available"
        },
        {
            $set: { status: "Booked" }
        },
        { new: true }
    );

    if (!timeslot) {
        throw new ApiError(409, "Selected timeslot is not available");
    }

    const appointment = await Appointment.create({
        userId,
        doctorId,
        date,
        time,
        status: "Scheduled",
        paymentStatus: "Pending"
    });

    // Send confirmation email (don't block response if fails)
    try {
        const user = await User.findById(userId);
        const message = `
            <h1>Appointment Confirmation</h1>
            <p>Dear ${user.name.first},</p>
            <p>Your appointment with Dr. ${doctor.name.first} ${doctor.name.last} has been scheduled.</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Status: Scheduled</p>
            <br>
            <p>Thank you for choosing HealthVision.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: "Appointment Confirmation - HealthVision",
            message: `Your appointment with Dr. ${doctor.name.first} on ${new Date(date).toLocaleDateString()} at ${time} is confirmed.`,
            html: message
        });
    } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Continue execution, don't fail the request
    }

    return res.status(201).json(new ApiResponse(201, appointment, "Appointment created successfully"));
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