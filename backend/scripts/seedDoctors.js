import mongoose from "mongoose";
import dotenv from "dotenv";
import { Doctor } from "../src/models/doctor.model.js";

dotenv.config();

const doctors = [
    {
        name: "Dr. Abhay Tripathi",
        specialization: "Cardiologist",
        experience: 15,
        rating: 4.9,
        availability: ["Mon-Fri 10:00 AM - 02:00 PM", "Sat 10:00 AM - 01:00 PM"],
        fee: 1500,
    },
    {
        name: "Dr. Gaurav Gupta",
        specialization: "Dermatologist",
        experience: 8,
        rating: 4.7,
        availability: ["Mon-Sat 11:00 AM - 04:00 PM"],
        fee: 800,
    },
    {
        name: "Dr. Isha Tripathi",
        specialization: "Dentist",
        experience: 10,
        rating: 4.8,
        availability: ["Mon-Fri 09:00 AM - 01:00 PM", "Mon-Fri 05:00 PM - 08:00 PM"],
        fee: 1000,
    },
    {
        name: "Dr. Sadhna Yadav",
        specialization: "Gynecologist",
        experience: 12,
        rating: 4.9,
        availability: ["Mon-Sat 10:30 AM - 02:30 PM"],
        fee: 1200,
    },
    {
        name: "Dr. Amit Sharma",
        specialization: "Orthopedic Surgeon",
        experience: 20,
        rating: 4.6,
        availability: ["Tue-Sun 10:00 AM - 02:00 PM"],
        fee: 2000,
    },
    {
        name: "Dr. Rohit Saxena",
        specialization: "General Physician",
        experience: 25,
        rating: 4.5,
        availability: ["Mon-Sat 09:00 AM - 09:00 PM"],
        fee: 500,
    }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await Doctor.deleteMany({});
        console.log("Cleared existing doctor data.");

        // Insert new data
        await Doctor.insertMany(doctors);
        console.log("Successfully seeded doctor data!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedDoctors();
