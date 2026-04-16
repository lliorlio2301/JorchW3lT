export interface GalleryImage {
    id?: number;
    title?: string;
    description?: string;
    imageUrl: string;
    imageAlt?: string;
    monthlyHighlight: boolean;
    hasBackground: boolean;
    createdAt?: string;
}
