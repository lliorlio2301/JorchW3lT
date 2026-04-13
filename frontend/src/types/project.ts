export interface Project {
    id?: number;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt?: string;
    githubUrl: string;
    demoUrl: string;
    techTags: string[];
}
