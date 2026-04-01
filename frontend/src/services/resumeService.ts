import api from './api';
import type { Resume } from '../types/resume';

const ENDPOINT = '/resume';

export const resumeService = {
    getResume: async (locale: string): Promise<Resume> => {
        const response = await api.get<Resume>(`${ENDPOINT}?locale=${locale}`);
        return response.data;
    },

    // Kept for API completeness if needed later, but backend currently focused on single resume
    getResumeById: async (id: number, locale: string): Promise<Resume> => {
        const response = await api.get<Resume>(`${ENDPOINT}/${id}?locale=${locale}`);
        return response.data;
    },

    saveResume: async (resume: Resume): Promise<Resume> => {
        const response = await api.post<Resume>(ENDPOINT, resume);
        return response.data;
    },
};

export default resumeService;
