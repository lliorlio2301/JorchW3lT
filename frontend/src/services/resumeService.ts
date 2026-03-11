import axios from 'axios';
import { Resume } from '../types/resume';

const API_BASE_URL = 'http://localhost:8080/api/resume';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
