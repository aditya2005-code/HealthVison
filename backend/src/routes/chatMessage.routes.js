import express from "express";
import { 
    createChatMessage, 
    getChatHistory, 
    getChatMessageById, 
    deleteChatMessage,
    deleteChatHistory 
} from "../controllers/chatMessage.controller.js";

const router = express.Router();

// Create a new chat message
router.post("/message", createChatMessage);

// Get chat history for a specific user (with pagination and filtering)
// Query params: ?limit=50&page=1&urgency=High
router.get("/history/:userId", getChatHistory);

// Get a specific chat message by ID
router.get("/message/:messageId", getChatMessageById);

// Delete a specific chat message
router.delete("/message/:messageId", deleteChatMessage);

// Delete all chat history for a user
router.delete("/history/:userId", deleteChatHistory);

export default router;