import api from './api';

const paymentService = {
    createPayment: async (amount, appointmentId) => {
        const response = await api.post('/payment/create', {
            amount,
            appointmentId
        });
        return response.data;
    },

    verifyPayment: async (paymentData) => {
        const response = await api.post('/payment/verify', paymentData);
        return response.data;
    },

    getPaymentHistory: async () => {
        const response = await api.get('/payment/history');
        return response.data;
    }
};

export default paymentService;
