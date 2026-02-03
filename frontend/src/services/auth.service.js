import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/auth/';

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

const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        if (response.data.token) {
            // Flatten the structure: { token, ...userProfile }
            const userData = {
                token: response.data.token,
                ...response.data.user
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            const userDataToSave = {
                token: response.data.token,
                ...response.data.user
            };
            localStorage.setItem('user', JSON.stringify(userDataToSave));
            return userDataToSave;
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

const resetPassword = async (token, password) => {
    try {
        const response = await api.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
};

export default authService;
