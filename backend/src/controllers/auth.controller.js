import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role, // Added role
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      height,
      weight,
      allergies,
      medicalHistory,
      currentMedications,
      emergencyContact,
      insurance,
    } = req.body;

    // Validate required fields based on User model
    if (
      !name ||
      !name.first ||
      !email ||
      !password ||
      !phone ||
      !dateOfBirth ||
      !gender ||
      !bloodGroup ||
      !height ||
      !weight ||
      !emergencyContact ||
      !emergencyContact.name ||
      !emergencyContact.phone ||
      !emergencyContact.relation
    ) {
      return res.status(400).json({ message: "All required fields are required." });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Password hashing is now handled by the User model's pre-save middleware

    const user = await User.create({
      name,
      email,
      password, // Plain text password passed to model; model hashes it.
      role, // Pass role
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      height,
      weight,
      allergies,
      medicalHistory,
      currentMedications,
      emergencyContact,
      insurance,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Return role
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        bloodGroup: user.bloodGroup,
        height: user.height,
        weight: user.weight,
        allergies: user.allergies,
        medicalHistory: user.medicalHistory,
        currentMedications: user.currentMedications,
        emergencyContact: user.emergencyContact,
        insurance: user.insurance
      },
    });
  } catch (error) {
    next(error);
  }
};
