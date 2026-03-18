import api from './api';
import type { Note } from '../types/note';

const ENDPOINT = '/notes';

export const noteService = {
    getAllNotes: async (): Promise<Note[]> => {
        const response = await api.get<Note[]>(ENDPOINT);
        return response.data;
    },

    getNoteById: async (id: number): Promise<Note> => {
        const response = await api.get<Note>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    saveNote: async (note: Note): Promise<Note> => {
        if (note.id) {
            const response = await api.put<Note>(`${ENDPOINT}/${note.id}`, note);
            return response.data;
        } else {
            const response = await api.post<Note>(ENDPOINT, note);
            return response.data;
        }
    },

    deleteNote: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};

export default noteService;
