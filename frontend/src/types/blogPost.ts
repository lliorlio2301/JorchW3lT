export interface BlogPost {
    id?: number;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    coverImageUrl?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}
