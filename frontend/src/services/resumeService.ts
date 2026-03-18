import api from './api';
import type { Resume } from '../types/resume';

const ENDPOINT = '/resume';

export const resumeService = {
    getAllResumes: async (): Promise<Resume[]> => {
        const response = await api.get<Resume[]>(ENDPOINT);
        return response.data;
    },

    getResumeById: async (id: number): Promise<Resume> => {
        const response = await api.get<Resume>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    saveResume: async (resume: Resume): Promise<Resume> => {
        const response = await api.post<Resume>(ENDPOINT, resume);
        return response.data;
    },
};

export default resumeService;
