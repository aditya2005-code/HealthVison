import { Appointment } from "../models/appointment.models.js";
import Report from "../models/report.model.js";

export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [appointmentStats, reportCount, consultationCount] = await Promise.all([
            // Aggregate appointments stats
            Appointment.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }
                    }
                }
            ]),
            // Count reports
            Report.countDocuments({ userId: userId }),
            // Count consultations (Completed appointments)
            Appointment.countDocuments({ userId: userId, status: "Completed" })
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