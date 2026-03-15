import axios from 'axios';
import type { ListItem } from '../types/listItem';

const API_BASE_URL = 'http://localhost:8080/api/shopping-list';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const shoppingListService = {
    getAllItems: async (): Promise<ListItem[]> => {
        const response = await api.get<ListItem[]>('');
        return response.data;
    },

    saveItem: async (item: Partial<ListItem>): Promise<ListItem> => {
        const response = await api.post<ListItem>('', item);
        return response.data;
    },

    deleteItem: async (id: number): Promise<void> => {
        await api.delete(`/${id}`);
    },

    toggleCompleted: async (id: number): Promise<ListItem> => {
        const response = await api.patch<ListItem>(`/${id}/toggle`);
        return response.data;
    },
};

export default shoppingListService;
