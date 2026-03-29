import api from './api';
import type { GalleryImage } from '../types/galleryImage';

const galleryService = {
    getAllImages: async (): Promise<GalleryImage[]> => {
        const response = await api.get<GalleryImage[]>('/gallery');
        return response.data;
    },

    getMonthlyHighlight: async (): Promise<GalleryImage | null> => {
        const response = await api.get<GalleryImage | null>('/gallery/highlight');
        return response.data;
    },

    saveImage: async (image: GalleryImage): Promise<GalleryImage> => {
        const response = await api.post<GalleryImage>('/gallery', image);
        return response.data;
    },

    deleteImage: async (id: number): Promise<void> => {
        await api.delete(`/gallery/${id}`);
    }
};

export default galleryService;
