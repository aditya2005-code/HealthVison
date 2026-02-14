import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAppointments = async () => {
    const user = authService.getCurrentUser();
    const token = user?.token;

    const response = await axios.get(`${API_URL}/appointments`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

const appointmentService = {
    getAppointments,

    getTimeslots: async (doctorId, date) => {
        const user = authService.getCurrentUser();
        const token = user?.token;
        const response = await axios.get(`${API_URL}/appointments/timeslots/${doctorId}?date=${date}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    bookAppointment: async (bookingData) => {
        const user = authService.getCurrentUser();
        const token = user?.token;
        const response = await axios.post(`${API_URL}/appointments`, bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default appointmentService;
