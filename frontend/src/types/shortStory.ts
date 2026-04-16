export interface ShortStory {
    id?: number;
    title: string;
    content: string;
    summary?: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
    tags?: string[];
    createdAt?: string;
}
