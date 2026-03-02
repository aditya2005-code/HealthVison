import api from './api';

const getAppointments = async () => {
    const response = await api.get('/appointments');
    return response.data;
};

const appointmentService = {
    getAppointments,

    getTimeslots: async (doctorId, date) => {
        const response = await api.get(`/appointments/timeslots/${doctorId}?date=${date}`);
        return response.data;
    },

    bookAppointment: async (bookingData) => {
        const response = await api.post('/appointments', bookingData);
        return response.data;
    },

    cancelAppointment: async (id) => {
        const response = await api.put(`/appointments/${id}/cancel`, {});
        return response.data;
    }
};

export default appointmentService;
