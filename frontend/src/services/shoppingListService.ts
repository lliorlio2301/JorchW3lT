import api from './api';
import type { ListItem } from '../types/listItem';

const ENDPOINT = '/shopping-list';

export const shoppingListService = {
    getAllItems: async (): Promise<ListItem[]> => {
        const response = await api.get<ListItem[]>(ENDPOINT);
        return response.data;
    },

    saveItem: async (item: Partial<ListItem>): Promise<ListItem> => {
        const response = await api.post<ListItem>(ENDPOINT, item);
        return response.data;
    },

    deleteItem: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    toggleCompleted: async (id: number): Promise<ListItem> => {
        const response = await api.patch<ListItem>(`${ENDPOINT}/${id}/toggle`);
        return response.data;
    },
};

export default shoppingListService;
