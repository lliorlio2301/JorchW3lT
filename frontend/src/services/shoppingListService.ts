import api from './api';
import type { ListItem } from '../types/listItem';
import { db } from '../db';

const ENDPOINT = '/shopping-list';

export const shoppingListService = {
    getAllItems: async (): Promise<ListItem[]> => {
        try {
            const response = await api.get<ListItem[]>(ENDPOINT);
            const items = response.data;
            
            // Sync with local DB
            await db.listItems.clear();
            await db.listItems.bulkAdd(items);
            
            return items;
        } catch (error) {
            console.warn('Offline: Loading shopping list from local DB', error);
            return await db.listItems.toArray();
        }
    },

    saveItem: async (item: Partial<ListItem>): Promise<ListItem> => {
        const response = await api.post<ListItem>(ENDPOINT, item);
        const savedItem = response.data;
        
        // Update local DB
        if (savedItem.id) {
            await db.listItems.put(savedItem);
        }
        
        return savedItem;
    },

    deleteItem: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
        await db.listItems.delete(id);
    },

    toggleCompleted: async (id: number): Promise<ListItem> => {
        const response = await api.patch<ListItem>(`${ENDPOINT}/${id}/toggle`);
        const updatedItem = response.data;
        
        await db.listItems.put(updatedItem);
        return updatedItem;
    },
};

export default shoppingListService;
