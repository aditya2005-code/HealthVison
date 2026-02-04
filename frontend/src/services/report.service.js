import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/reports';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Upload a medical report file
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for upload progress
 * @returns {Promise} - Upload response
 */
const uploadReport = async (file, onProgress) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/reports/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

/**
 * Get all reports for the authenticated user
 * @returns {Promise} - List of reports
 */
const getUserReports = async () => {
    try {
        const response = await api.get('/reports');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

/**
 * Get a specific report by ID
 * @param {string} id - Report ID
 * @returns {Promise} - Report details
 */
const getReportById = async (id) => {
    try {
        const response = await api.get(`/reports/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

/**
 * Delete a report
 * @param {string} id - Report ID
 * @returns {Promise} - Delete confirmation
 */
const deleteReport = async (id) => {
    try {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

const reportService = {
    uploadReport,
    getUserReports,
    getReportById,
    deleteReport,
};

export default reportService;
