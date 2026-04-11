export interface Experience {
    id?: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface ExperienceFull {
    id?: number;
    titleDe: string;
    titleEn: string;
    titleEs: string;
    company: string;
    locationDe: string;
    locationEn: string;
    locationEs: string;
    startDate: string;
    endDate: string;
    descriptionDe: string;
    descriptionEn: string;
    descriptionEs: string;
}

export interface Education {
    id?: number;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface EducationFull {
    id?: number;
    degreeDe: string;
    degreeEn: string;
    degreeEs: string;
    institution: string;
    locationDe: string;
    locationEn: string;
    locationEs: string;
    startDate: string;
    endDate: string;
    descriptionDe: string;
    descriptionEn: string;
    descriptionEs: string;
}

export interface Resume {
    id?: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experiences: Experience[];
    education: Education[];
}

export interface ResumeFull {
    id?: number;
    name: string;
    email: string;
    phone: string;
    locationDe: string;
    locationEn: string;
    locationEs: string;
    summaryDe: string;
    summaryEn: string;
    summaryEs: string;
    experiences: ExperienceFull[];
    education: EducationFull[];
}
