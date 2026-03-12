import axios from 'axios';
import i18n from '../i18n';
import type { Resume } from '../types/resume';

const API_BASE_URL = 'http://localhost:8080/api/resume';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include language header
api.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.language;
    return config;
});

export const resumeService = {
    getAllResumes: async (): Promise<Resume[]> => {
        const response = await api.get<Resume[]>('');
        return response.data;
    },

    getResumeById: async (id: number): Promise<Resume> => {
        const response = await api.get<Resume>(`/${id}`);
        return response.data;
    },

    saveResume: async (resume: Resume): Promise<Resume> => {
        const response = await api.post<Resume>('', resume);
        return response.data;
    },
};

export default resumeService;
