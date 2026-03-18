import api from './api';
import type { Song } from '../types/song';

const ENDPOINT = '/songs';

export const songService = {
    getAllSongs: async (): Promise<Song[]> => {
        const response = await api.get<Song[]>(ENDPOINT);
        return response.data;
    },

    getSongById: async (id: number): Promise<Song> => {
        const response = await api.get<Song>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    saveSong: async (song: Omit<Song, 'id'>): Promise<Song> => {
        const response = await api.post<Song>(ENDPOINT, song);
        return response.data;
    },

    updateSong: async (id: number, song: Omit<Song, 'id'>): Promise<Song> => {
        const response = await api.put<Song>(`${ENDPOINT}/${id}`, song);
        return response.data;
    },

    deleteSong: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};

export default songService;
