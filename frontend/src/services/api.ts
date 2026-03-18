import axios from 'axios';
import i18n from '../i18n';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Authorization and Language headers
api.interceptors.request.use(
    (config) => {
        // Add Token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add Language
        config.headers['Accept-Language'] = i18n.language || 'de';
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
