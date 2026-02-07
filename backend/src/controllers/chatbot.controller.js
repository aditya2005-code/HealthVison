import { ChatMessage } from "../models/chat.model.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { message, urgency } = req.body;
        const userId = req.user.id; // Asuming user is authenticated and userId is in req.user

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // Placeholder for AI response logic
        let responseText = "I received your message: " + message;
        if (urgency === 'High') {
            responseText = "This sounds urgent. Please consider contacting emergency services if this is a medical emergency. " + responseText;
        }

        const chatMessage = await ChatMessage.create({
            userId,
            message,
            response: responseText,
            urgency: urgency || 'Low' // Default to Low if not provided
        });

        res.status(201).json({
            success: true,
            data: chatMessage
        });
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const history = await ChatMessage.find({ userId }).sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        next(error);
    }
};
