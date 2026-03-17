import axios from 'axios';
import type { Project, ProjectCreate } from '../types/project';

const API_URL = '/api/projects';

export const projectService = {
    getAllProjects: async (): Promise<Project[]> => {
        const response = await axios.get<Project[]>(API_URL);
        return response.data;
    },

    getProjectById: async (id: number): Promise<Project> => {
        const response = await axios.get<Project>(`${API_URL}/${id}`);
        return response.data;
    },

    getProjectForEdit: async (id: number): Promise<ProjectCreate> => {
        const response = await axios.get<ProjectCreate>(`${API_URL}/${id}/edit`);
        return response.data;
    },

    saveProject: async (project: ProjectCreate): Promise<Project> => {
        const response = await axios.post<Project>(API_URL, project);
        return response.data;
    },

    updateProject: async (id: number, project: ProjectCreate): Promise<Project> => {
        const response = await axios.put<Project>(`${API_URL}/${id}`, project);
        return response.data;
    },

    deleteProject: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },
};

export default projectService;
