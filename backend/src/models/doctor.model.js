import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        specialization: {
            type: String,
            required: true,
            trim: true,
        },
        experience: {
            type: Number,
            required: true,
            min: 0,
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },
        availability: {
            type: [String],
            default: [],
        },
        about: {
            type: String,
            required: true,
            trim: true,
        },
        qualifications: {
            type: String, // e.g., "MBBS, MD"
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        languages: {
            type: [String],
            default: ["English", "Hindi"],
        },
        registration: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: String, // Store phone number as string
            required: true,
            trim: true,
        },
        fee: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
