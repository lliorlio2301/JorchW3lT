import axios from 'axios';
import i18n from '../i18n';
import type { Project } from '../types/project';

const API_BASE_URL = 'http://localhost:8080/api/projects';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.language;
    return config;
});

export const projectService = {
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get<Project[]>('');
        return response.data;
    },

    getProjectById: async (id: number): Promise<Project> => {
        const response = await api.get<Project>(`/${id}`);
        return response.data;
    },
};

export default projectService;
