import api from './api';
import type { Note } from '../types/note';
import { db } from '../db';

const ENDPOINT = '/notes';

export const noteService = {
    getAllNotes: async (): Promise<Note[]> => {
        try {
            const response = await api.get<Note[]>(ENDPOINT);
            const notes = response.data;
            
            // Sync with local DB
            await db.notes.clear();
            await db.notes.bulkAdd(notes);
            
            return notes;
        } catch (error) {
            console.warn('Offline: Loading notes from local DB', error);
            // Return sorted by createdAt desc just like backend
            const localNotes = await db.notes.toArray();
            return localNotes.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        }
    },

    getNoteById: async (id: number): Promise<Note> => {
        try {
            const response = await api.get<Note>(`${ENDPOINT}/${id}`);
            const note = response.data;
            await db.notes.put(note);
            return note;
        } catch (error) {
            console.warn('Offline: Loading single note from local DB', error);
            const localNote = await db.notes.get(id);
            if (!localNote) throw error;
            return localNote;
        }
    },

    saveNote: async (note: Note): Promise<Note> => {
        let savedNote: Note;
        if (note.id) {
            const response = await api.put<Note>(`${ENDPOINT}/${note.id}`, note);
            savedNote = response.data;
        } else {
            const response = await api.post<Note>(ENDPOINT, note);
            savedNote = response.data;
        }
        
        // Update local DB
        await db.notes.put(savedNote);
        return savedNote;
    },

    deleteNote: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
        await db.notes.delete(id);
    },
};

export default noteService;
