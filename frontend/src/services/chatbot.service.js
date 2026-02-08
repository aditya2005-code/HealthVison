import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const sendMessage = async (message, urgency) => {
    const user = authService.getCurrentUser();
    const token = user?.token;

    const response = await axios.post(`${API_URL}/chatbot/message`,
        { message, urgency },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const getHistory = async () => {
    const user = authService.getCurrentUser();
    const token = user?.token;

    const response = await axios.get(`${API_URL}/chatbot/history`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

const chatbotService = {
    sendMessage,
    getHistory
};

export default chatbotService;
