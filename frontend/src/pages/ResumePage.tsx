import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import resumeService from '../services/resumeService';
import type { Resume } from '../types/resume';
import './ResumePage.css';

const ResumePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            setLoading(true);
            try {
                const resumes = await resumeService.getAllResumes();
                if (resumes.length > 0) {
                    setResume(resumes[0]);
                }
            } catch (err) {
                console.error('Failed to fetch resume:', err);
                setError(t('resume.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [i18n.language, t]); // Refetch when language changes

    if (loading) return <div className="resume-status">{t('resume.loading')}</div>;
    if (error) return <div className="resume-status error">{error}</div>;
    if (!resume) return <div className="resume-status">{t('resume.noData')}</div>;

    return (
        <div className="resume-container">
            <header className="resume-header">
                <h1>{resume.name}</h1>
                <div className="contact-info">
                    <span>{resume.email}</span> | 
                    <span>{resume.phone}</span> | 
                    <span>{resume.location}</span>
                </div>
            </header>

            <section className="resume-section">
                <h2>{t('resume.summary')}</h2>
                <p>{resume.summary}</p>
            </section>

            <section className="resume-section">
                <h2>{t('resume.experience')}</h2>
                <div className="experience-list">
                    {resume.experiences.map((exp) => (
                        <div key={exp.id} className="experience-item">
                            <h3>{exp.title} at {exp.company}</h3>
                            <div className="item-meta">
                                <span>{exp.location}</span> | 
                                <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="resume-section">
                <h2>{t('resume.education')}</h2>
                <div className="education-list">
                    {resume.education.map((edu) => (
                        <div key={edu.id} className="education-item">
                            <h3>{edu.degree}</h3>
                            <div className="item-meta">
                                <span>{edu.institution}, {edu.location}</span> | 
                                <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p>{edu.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ResumePage;
