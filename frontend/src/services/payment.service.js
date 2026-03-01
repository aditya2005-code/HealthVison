import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const paymentService = {
    createPayment: async (amount, appointmentId) => {
        const user = authService.getCurrentUser();
        const token = user?.token;
        const response = await axios.post(`${API_URL}/payment/create`, {
            amount,
            appointmentId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    verifyPayment: async (paymentData) => {
        const user = authService.getCurrentUser();
        const token = user?.token;
        const response = await axios.post(`${API_URL}/payment/verify`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getPaymentHistory: async () => {
        const user = authService.getCurrentUser();
        const token = user?.token;
        const response = await axios.get(`${API_URL}/payment/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default paymentService;
