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

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Call refresh endpoint directly to avoid interceptor loop
                    const response = await axios.post('/api/auth/refresh-token', { refreshToken });
                    const { token } = response.data;

                    localStorage.setItem('token', token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    originalRequest.headers.Authorization = `Bearer ${token}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, logout
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
