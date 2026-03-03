import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      trim: true
    },
    last: {
      type: String,
      trim: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient"
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  allergies: [{
    type: String
  }],
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    notes: String
  }],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  hospitalDetails: {
    patientId: {
      type: String,
      unique: true,
      sparse: true
    },
    admissionDate: {
      type: Date,
      default: Date.now
    },
    dischargeDate: Date,
    roomNumber: String,
    doctorAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Outpatient", "Emergency"],
      default: "Admitted"
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    relation: {
      type: String,
      required: true
    }
  },
  insurance: {
    provider: String,
    policyNumber: String,
    validTill: Date
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
