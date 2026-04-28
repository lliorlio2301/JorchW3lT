import axios from 'axios';
import api from './api';
import type { Note } from '../types/note';
import { db } from '../db';

const ENDPOINT = '/notes';
const UPLOAD_ENDPOINT = '/upload';

interface GetNotesOptions {
    archived?: boolean;
    query?: string;
}

const sortNotes = (items: Note[]): Note[] => {
    return [...items].sort((a, b) => {
        const pinA = a.pinned ? 1 : 0;
        const pinB = b.pinned ? 1 : 0;
        if (pinA !== pinB) {
            return pinB - pinA;
        }

        const dateA = a.updatedAt ?? a.createdAt ?? '';
        const dateB = b.updatedAt ?? b.createdAt ?? '';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
};

const matchesQuery = (note: Note, query?: string): boolean => {
    if (!query) {
        return true;
    }
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
        return true;
    }

    return `${note.title} ${note.content}`.toLowerCase().includes(normalized);
};

const shouldUseOfflineFallback = (error: unknown): boolean => {
    if (!axios.isAxiosError(error)) {
        return true;
    }

    const status = error.response?.status;
    return status == null || status >= 500;
};

export const noteService = {
    getAllNotes: async (options: GetNotesOptions = {}): Promise<Note[]> => {
        const archived = options.archived ?? false;
        const query = options.query?.trim() ?? '';
        try {
            const response = await api.get<Note[]>(ENDPOINT, {
                params: {
                    archived,
                    query: query || undefined
                }
            });
            const notes = sortNotes(response.data);
            
            // Sync with local DB
            await db.notes.clear();
            await db.notes.bulkAdd(notes);
            
            return notes;
        } catch (error) {
            if (!shouldUseOfflineFallback(error)) {
                throw error;
            }
            console.warn('Offline: Loading notes from local DB', error);
            // Return filtered and sorted local data as backend fallback
            const localNotes = await db.notes.toArray();
            return sortNotes(
                localNotes.filter(note => (note.archived ?? false) === archived && matchesQuery(note, query))
            );
        }
    },

    getNoteById: async (id: number): Promise<Note> => {
        try {
            const response = await api.get<Note>(`${ENDPOINT}/${id}`);
            const note = response.data;
            await db.notes.put(note);
            return note;
        } catch (error) {
            if (!shouldUseOfflineFallback(error)) {
                throw error;
            }
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

    setPinned: async (id: number, pinned: boolean): Promise<Note> => {
        const response = await api.patch<Note>(`${ENDPOINT}/${id}/pin`, undefined, {
            params: { pinned }
        });
        await db.notes.put(response.data);
        return response.data;
    },

    setArchived: async (id: number, archived: boolean): Promise<Note> => {
        const response = await api.patch<Note>(`${ENDPOINT}/${id}/archive`, undefined, {
            params: { archived }
        });
        await db.notes.put(response.data);
        return response.data;
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>(UPLOAD_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.url;
    },

    deleteNote: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
        await db.notes.delete(id);
    },
};

export default noteService;
