export interface Experience {
    id?: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
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
