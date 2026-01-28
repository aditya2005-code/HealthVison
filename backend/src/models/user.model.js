import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      trim: true
    },
    last: {
      type: String,
      required: true,
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
      required: true
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
  }
}, {
  timestamps: true
});

export const User = mongoose.model("User", userSchema);
