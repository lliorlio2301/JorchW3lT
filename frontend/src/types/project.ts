export interface Project {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    githubUrl: string;
    demoUrl: string;
    techTags: string[];
}

export interface ProjectCreate {
    id?: number;
    titleDe: string;
    titleEn: string;
    titleEs: string;
    descriptionDe: string;
    descriptionEn: string;
    descriptionEs: string;
    imageUrl: string;
    githubUrl: string;
    demoUrl: string;
    techTags: string[];
}
