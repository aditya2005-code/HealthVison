import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class DoctorService {
    async getAllDoctors() {
        try {
            const response = await axios.get(`${API_URL}/doctors`);
            return response.data;
        } catch (error) {
            console.error("Error fetching doctors:", error);
            throw error;
        }
    }

    async getDoctorById(id) {
        try {
            const response = await axios.get(`${API_URL}/doctors/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching doctor with id ${id}:`, error);
            throw error;
        }
    }
}

export default new DoctorService();
