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

export const getDoctorProfile = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDoctorProfile = async (req, res, next) => {
    try {
        let doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            // Create if it doesn't exist for some reason
            doctor = await Doctor.create({
                userId: req.user._id,
                name: `${req.user.name.first} ${req.user.name.last || ''}`.trim(),
                ...req.body
            });
        } else {
            doctor = await Doctor.findOneAndUpdate(
                { userId: req.user._id },
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

        res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};
