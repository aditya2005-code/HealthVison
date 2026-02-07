import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    response: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
