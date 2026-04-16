export interface Note {
    id?: number;
    title: string;
    createdAt?: string;
    updatedAt?: string;
    content: string;
    pinned?: boolean;
    archived?: boolean;
}
