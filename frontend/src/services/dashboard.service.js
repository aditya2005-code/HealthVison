import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getStats = async () => {
    const user = authService.getCurrentUser();
    const token = user?.token;

    const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

const dashboardService = {
    getStats,
};

export default dashboardService;
