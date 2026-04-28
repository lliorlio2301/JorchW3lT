import axios from 'axios';
import i18n from '../i18n';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
};

const redirectToLogin = (reason: string) => {
    window.location.href = `/login?reason=${encodeURIComponent(reason)}`;
};

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
        const status = error.response?.status;
        const requestUrl: string = originalRequest?.url ?? '';
        const isRefreshRequest = requestUrl.includes('/auth/refresh-token');
        const isLoginRequest = requestUrl.includes('/auth/login');
        const refreshToken = localStorage.getItem('refreshToken');

        // Try token refresh once for auth errors before logging the user out.
        if ((status === 401 || status === 403) && !isRefreshRequest && !isLoginRequest && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call refresh endpoint directly to avoid interceptor loop
                const response = await axios.post('/api/auth/refresh-token', { refreshToken });
                const { token, refreshToken: rotatedRefreshToken } = response.data;

                localStorage.setItem('token', token);
                if (rotatedRefreshToken) {
                    localStorage.setItem('refreshToken', rotatedRefreshToken);
                }
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                originalRequest.headers.Authorization = `Bearer ${token}`;

                return api(originalRequest);
            } catch (refreshError) {
                clearAuthState();
                redirectToLogin('sessionExpired');
                return Promise.reject(refreshError);
            }
        }

        if ((status === 401 || status === 403) && !isRefreshRequest && !isLoginRequest) {
            clearAuthState();
            redirectToLogin('sessionExpired');
        }

        return Promise.reject(error);
    }
);

export default api;
