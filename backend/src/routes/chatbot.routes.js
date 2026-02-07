import express from 'express';
import { sendMessage, getHistory } from '../controllers/chatbot.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // Assuming auth middleware exists

const router = express.Router();

router.post('/message', protect, sendMessage);
router.get('/history', protect, getHistory);

export default router;
