import { Appointment } from "../models/appointment.models.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
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

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    // Check if slot is already booked
    let timeslot = await Timeslot.findOne({
        doctorId,
        date: new Date(date),
        time
    });

    if (timeslot && timeslot.status === "Booked") {
        throw new ApiError(409, "Selected timeslot is not available");
    }

    // If slot exists and available, or doesn't exist, mark/create as booked
    if (timeslot) {
        timeslot.status = "Booked";
        await timeslot.save();
    } else {
        timeslot = await Timeslot.create({
            doctorId,
            date: new Date(date),
            time,
            status: "Booked"
        });
    }

    const appointment = await Appointment.create({
        userId,
        doctorId,
        date,
        time,
        status: "Scheduled",
        paymentStatus: "Pending"
    });

    return res.status(201).json(new ApiResponse(201, appointment, "Appointment created successfully"));
});

export const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
        $or: [
            { userId: req.user.id },
            // { doctorId: req.user.id } // Disabled until Doctor-User linkage is established
        ]
    })
        .populate("userId", "name email")
        .populate("doctorId", "name specialization location image");

    return res.status(200).json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

export const getAppointmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
        .populate("userId", "name email")
        .populate("doctorId", "name specialization location image");

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.userId._id.toString() !== req.user.id) {
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

    if (appointment.userId._id.toString() !== req.user.id) {
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

    if (appointment.userId._id.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to delete this appointment");
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "Appointment deleted successfully"));
});

export const getTimeslotsForDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
        throw new ApiError(400, "Date parameter is required");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    // 1. Define standard working hours (9:00 AM to 5:00 PM)
    const startHour = 9;
    const endHour = 16;

    const allSlots = [];

    for (let hour = startHour; hour < endHour; hour++) {
        // Hour:00
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        allSlots.push(timeStr);

        // Hour:30
        const timeStrHalf = `${hour.toString().padStart(2, '0')}:30`;
        allSlots.push(timeStrHalf);
    }

    // 2. Fetch booked slots from DB
    // We search for slots that are specifically BOOKED for this doctor on this date
    // Note: 'date' comes as string YYYY-MM-DD.
    // Timeslot model stores date as Date object. We need to match the day.
    const queryDate = new Date(date);

    // Create start and end of the day for query
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSlots = await Timeslot.find({
        doctorId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        },
        status: "Booked"
    }).select("time");

    const bookedTimes = bookedSlots.map(slot => slot.time);

    // 3. Construct response
    const timeslotData = allSlots.map(time => ({
        id: `${date}-${time}`,
        time,
        isAvailable: !bookedTimes.includes(time) // Available if NOT in booked list
    }));

    return res.status(200).json(new ApiResponse(200, timeslotData, "Timeslots fetched successfully"));
});
export const cancelAppointment = asyncHandler(async (req, res) => {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.userId._id.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to cancel this appointment");
    }

    let message = "Appointment cancelled successfully";
    if (appointment.paymentStatus === "Paid") {
        message = "Appointment cancelled successfully. Payment will be transferred to your HealthVision Wallet";
    }

    appointment.status = "Cancelled";
    await appointment.save();

    // Send cancellation email (async, don't block response)
    const sendCancellationEmail = async () => {
        try {
            const user = await User.findById(req.user.id);
            const doctor = await Doctor.findById(appointment.doctorId);

            const emailHtml = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <div style="background-color: #dc3545; padding: 25px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">HealthVision</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <span style="background-color: #fce8e6; color: #dc3545; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Appointment Cancelled</span>
                        </div>
                        <p style="font-size: 16px; color: #333333; line-height: 1.6;">Dear <strong>${user.name.first || user.name}</strong>,</p>
                        <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-bottom: 20px;">This is to confirm that your appointment has been cancelled.</p>
                        
                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #777777; font-size: 14px; width: 100px;">Doctor</td>
                                    <td style="padding: 8px 0; color: #333333; font-weight: 600; font-size: 15px;">Dr. ${doctor.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #777777; font-size: 14px;">Date</td>
                                    <td style="padding: 8px 0; color: #333333; font-weight: 600; font-size: 15px;">${new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #777777; font-size: 14px;">Time</td>
                                    <td style="padding: 8px 0; color: #333333; font-weight: 600; font-size: 15px;">${appointment.time}</td>
                                </tr>
                            </table>
                        </div>

                        ${appointment.paymentStatus === "Paid" ? `
                        <div style="border-left: 4px solid #ffc107; background-color: #fff9e6; padding: 15px; margin-bottom: 25px;">
                            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                                <strong>Refund Notice:</strong> Your payment will be transferred to your HealthVision Wallet shortly.
                            </p>
                        </div>
                        ` : ''}
                        
                        <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
                            If you did not request this cancellation, please contact our support team.
                        </p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                        <p style="font-size: 12px; color: #999999; margin: 0;">&copy; 2026 HealthVision. All rights reserved.</p>
                    </div>
                </div>
            `;

            await sendEmail({
                email: user.email,
                subject: "Appointment Cancelled - HealthVision",
                message: `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been cancelled.`,
                html: emailHtml
            });
        } catch (error) {
            console.error("Cancellation email failed:", error);
        }
    };
    sendCancellationEmail();

    // Release the timeslot
    await Timeslot.deleteOne({
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time
    });

    return res.status(200).json(new ApiResponse(200, {}, message));
});