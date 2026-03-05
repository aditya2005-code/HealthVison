import { Appointment } from "../models/appointment.models.js";
import Report from "../models/report.model.js";

export const getStats = async (req, res) => {
    try {
        const user = req.user;
        const role = user.role;

        let matchQuery = { userId: user._id };

        if (role === 'doctor') {
            const { Doctor } = await import("../models/doctor.model.js");
            const doctor = await Doctor.findOne({ userId: user._id });
            if (doctor) {
                matchQuery = { doctorId: doctor._id };
            }
        }

        const [appointmentStats, reportCount, consultationCount] = await Promise.all([
            // Aggregate appointments stats
            Appointment.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }
                    }
                }
            ]),
            // Count reports (only for patients)
            role === 'patient' ? Report.countDocuments({ userId: user._id }) : Promise.resolve(0),
            // Count consultations (Completed appointments)
            Appointment.countDocuments({ ...matchQuery, status: "Completed" })
        ]);

        res.status(200).json({
            success: true,
            data: {
                appointments: appointmentStats[0] || { total: 0, pending: 0 },
                reports: reportCount,
                consultations: consultationCount
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
}