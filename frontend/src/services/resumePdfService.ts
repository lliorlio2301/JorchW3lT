import { jsPDF } from 'jspdf';
import type { Education, Experience, Resume } from '../types/resume';

type ResumePdfLabels = {
    title: string;
    role: string;
    summary: string;
    experience: string;
    education: string;
    email: string;
    phone: string;
    location: string;
};

type GenerateResumePdfInput = {
    resume: Resume;
    labels: ResumePdfLabels;
};

const MARGIN = 18;
const LINE_HEIGHT = 6;
const SECTION_SPACING = 10;

const ensurePageSpace = (doc: jsPDF, y: number, requiredHeight: number): number => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + requiredHeight <= pageHeight - MARGIN) {
        return y;
    }

    doc.addPage();
    return MARGIN;
};

const writeWrappedText = (doc: jsPDF, text: string, y: number, width: number): number => {
    const lines = doc.splitTextToSize(text || '-', width);
    doc.text(lines, MARGIN, y);
    return y + (lines.length * LINE_HEIGHT);
};

const writeSectionTitle = (doc: jsPDF, title: string, y: number): number => {
    const nextY = ensurePageSpace(doc, y, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, MARGIN, nextY);
    return nextY + 8;
};

const writeExperienceEntry = (doc: jsPDF, experience: Experience, y: number, width: number): number => {
    let nextY = ensurePageSpace(doc, y, 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(experience.title || '-', MARGIN, nextY);
    nextY += LINE_HEIGHT;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${experience.company || '-'} | ${experience.startDate || '-'} - ${experience.endDate || '-'}`, MARGIN, nextY);
    nextY += LINE_HEIGHT;

    nextY = writeWrappedText(doc, experience.description || '-', nextY, width);
    return nextY + 4;
};

const writeEducationEntry = (doc: jsPDF, education: Education, y: number, width: number): number => {
    let nextY = ensurePageSpace(doc, y, 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(education.degree || '-', MARGIN, nextY);
    nextY += LINE_HEIGHT;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${education.institution || '-'} | ${education.startDate || '-'} - ${education.endDate || '-'}`, MARGIN, nextY);
    nextY += LINE_HEIGHT;

    nextY = writeWrappedText(doc, education.description || '-', nextY, width);
    return nextY + 4;
};

const sanitizeFileName = (name: string): string =>
    name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'resume';

export const generateResumePdf = ({ resume, labels }: GenerateResumePdfInput): void => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (2 * MARGIN);

    let y = MARGIN;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(resume.name || labels.title, MARGIN, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(labels.role, MARGIN, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`${labels.email}: ${resume.email || '-'}`, MARGIN, y);
    y += LINE_HEIGHT;
    doc.text(`${labels.phone}: ${resume.phone || '-'}`, MARGIN, y);
    y += LINE_HEIGHT;
    doc.text(`${labels.location}: ${resume.location || '-'}`, MARGIN, y);
    y += SECTION_SPACING;

    y = writeSectionTitle(doc, labels.summary, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y = writeWrappedText(doc, resume.summary || '-', y, contentWidth);
    y += SECTION_SPACING;

    y = writeSectionTitle(doc, labels.experience, y);
    resume.experiences.forEach((experience) => {
        y = writeExperienceEntry(doc, experience, y, contentWidth);
    });
    y += SECTION_SPACING;

    y = writeSectionTitle(doc, labels.education, y);
    resume.education.forEach((education) => {
        y = writeEducationEntry(doc, education, y, contentWidth);
    });

    doc.save(`${sanitizeFileName(resume.name)}-resume.pdf`);
};

