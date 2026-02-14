import express from 'express';
import { 
    sendMessage, 
    getHistory, 
    getReportConversations, 
    deleteMessage 
} from '../controllers/chatbot.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Send a message to chatbot (with optional report context)
router.post('/message', protect, sendMessage);
// Get chat history with pagination and filters
router.get('/history', protect, getHistory);
// Get conversations related to a specific report
router.get('/report/:reportId', protect, getReportConversations);
// Delete a chat message
router.delete('/message/:messageId', protect, deleteMessage);

export default router;
