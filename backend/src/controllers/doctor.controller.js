import { Doctor } from "../models/doctor.model.js";

export const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors,
        });
    } catch (error) {
        next(error);
    }
};

export const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        // Check for invalid ID format
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }
        next(error);
    }
};
