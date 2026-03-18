export interface BlogPost {
    id?: number;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    coverImageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}
