import api from './api';
import type { ShortStory } from '../types/shortStory';

const shortStoryService = {
    getAllStories: async (): Promise<ShortStory[]> => {
        const response = await api.get<ShortStory[]>('/stories');
        return response.data;
    },

    getStory: async (id: number): Promise<ShortStory> => {
        const response = await api.get<ShortStory>(`/stories/${id}`);
        return response.data;
    },

    saveStory: async (story: ShortStory): Promise<ShortStory> => {
        const response = await api.post<ShortStory>('/stories', story);
        return response.data;
    },

    deleteStory: async (id: number): Promise<void> => {
        await api.delete(`/stories/${id}`);
    }
};

export default shortStoryService;
