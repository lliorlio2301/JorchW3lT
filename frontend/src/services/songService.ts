import axios from 'axios';
import i18n from '../i18n';
import type { Song } from '../types/song';

const API_URL = '/api/songs';

// Use a custom interceptor for the language header on the default axios instance
axios.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.language;
    return config;
});

export const songService = {
    getAllSongs: async (): Promise<Song[]> => {
        const response = await axios.get<Song[]>(API_URL);
        return response.data;
    },

    getSongById: async (id: number): Promise<Song> => {
        const response = await axios.get<Song>(`${API_URL}/${id}`);
        return response.data;
    },

    saveSong: async (song: Omit<Song, 'id'>): Promise<Song> => {
        const response = await axios.post<Song>(API_URL, song);
        return response.data;
    },

    updateSong: async (id: number, song: Omit<Song, 'id'>): Promise<Song> => {
        const response = await axios.put<Song>(`${API_URL}/${id}`, song);
        return response.data;
    },

    deleteSong: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },
};

export default songService;
