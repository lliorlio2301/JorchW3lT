import api from './api';
import type { Project, ProjectCreate } from '../types/project';

const ENDPOINT = '/projects';

export const projectService = {
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get<Project[]>(ENDPOINT);
        return response.data;
    },

    getProjectById: async (id: number): Promise<Project> => {
        const response = await api.get<Project>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    getProjectForEdit: async (id: number): Promise<ProjectCreate> => {
        const response = await api.get<ProjectCreate>(`${ENDPOINT}/${id}/edit`);
        return response.data;
    },

    saveProject: async (project: ProjectCreate): Promise<Project> => {
        const response = await api.post<Project>(ENDPOINT, project);
        return response.data;
    },

    updateProject: async (id: number, project: ProjectCreate): Promise<Project> => {
        const response = await api.put<Project>(`${ENDPOINT}/${id}`, project);
        return response.data;
    },

    deleteProject: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};

export default projectService;
