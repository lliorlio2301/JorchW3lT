export interface GalleryImage {
    id?: number;
    title?: string;
    description?: string;
    imageUrl: string;
    monthlyHighlight: boolean;
    hasBackground: boolean;
    createdAt?: string;
}
