import api from './api';
import type { Project } from '../types/project';

const ENDPOINT = '/projects';
const UPLOAD_ENDPOINT = '/upload';

export const projectService = {
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get<Project[]>(ENDPOINT);
        return response.data;
    },

    getProjectById: async (id: number): Promise<Project> => {
        const response = await api.get<Project>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    getProjectForEdit: async (id: number): Promise<Project> => {
        const response = await api.get<Project>(`${ENDPOINT}/${id}/edit`);
        return response.data;
    },

    saveProject: async (project: Project): Promise<Project> => {
        const response = await api.post<Project>(ENDPOINT, project);
        return response.data;
    },

    updateProject: async (id: number, project: Project): Promise<Project> => {
        const response = await api.put<Project>(`${ENDPOINT}/${id}`, project);
        return response.data;
    },

    deleteProject: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{url: string}>(UPLOAD_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.url;
    }
};

export default projectService;
