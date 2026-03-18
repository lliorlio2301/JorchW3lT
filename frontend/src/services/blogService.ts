import api from './api';
import type { BlogPost } from '../types/blogPost';

const ENDPOINT = '/blog';
const UPLOAD_ENDPOINT = '/upload';

export const blogService = {
    getAllPosts: async (): Promise<BlogPost[]> => {
        const response = await api.get<BlogPost[]>(ENDPOINT);
        return response.data;
    },

    getPostBySlug: async (slug: string): Promise<BlogPost> => {
        const response = await api.get<BlogPost>(`${ENDPOINT}/${slug}`);
        return response.data;
    },

    savePost: async (post: BlogPost): Promise<BlogPost> => {
        if (post.id) {
            const response = await api.put<BlogPost>(`${ENDPOINT}/${post.id}`, post);
            return response.data;
        } else {
            const response = await api.post<BlogPost>(ENDPOINT, post);
            return response.data;
        }
    },

    deletePost: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{url: string}>(UPLOAD_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.url;
    }
};

export default blogService;
