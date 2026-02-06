import { Appointment } from "../models/appointment.models.js";
import Report from "../models/report.model.js";

export const getstats = async (req, res) => {
    try {
        const userId = req.user.id;
        const [appointmentStats, reportCount] = await Promise.all([
            Appointment.aggregate([
                { $match: { user: userId } },
                { $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } }
                }}
            ]),
            Report.countDocuments({ user: userId }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                appointments: appointmentStats[0] || { total: 0, pending: 0 },
                reports: reportCount
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