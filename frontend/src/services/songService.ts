import axios from 'axios';
import i18n from '../i18n';
import type { Song } from '../types/song';

const API_BASE_URL = 'http://localhost:8080/api/songs';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include language header
api.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.language;
    return config;
});

export const songService = {
    getAllSongs: async (): Promise<Song[]> => {
        const response = await api.get<Song[]>('');
        return response.data;
    },

    getSongById: async (id: number): Promise<Song> => {
        const response = await api.get<Song>(`/${id}`);
        return response.data;
    },

    saveSong: async (song: Song): Promise<Song> => {
        const response = await api.post<Song>('', song);
        return response.data;
    },

    deleteSong: async (id: number): Promise<void> => {
        await api.delete(`/${id}`);
    },
};

export default songService;
