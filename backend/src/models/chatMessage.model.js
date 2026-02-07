import mongoose from "mongoose";
const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        required: true
    }
}, { timestamps: true })

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;