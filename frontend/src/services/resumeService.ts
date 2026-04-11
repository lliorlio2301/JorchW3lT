import api from './api';
import type { Resume, ResumeFull } from '../types/resume';

const ENDPOINT = '/resume';

export const resumeService = {
    getResume: async (locale: string): Promise<Resume> => {
        const response = await api.get<Resume>(`${ENDPOINT}?locale=${locale}`);
        return response.data;
    },

    getFullResume: async (): Promise<ResumeFull> => {
        const response = await api.get<ResumeFull>(`${ENDPOINT}/full`);
        return response.data;
    },

    saveResume: async (resume: ResumeFull): Promise<ResumeFull> => {
        const response = await api.post<ResumeFull>(ENDPOINT, resume);
        return response.data;
    },
};

export default resumeService;
