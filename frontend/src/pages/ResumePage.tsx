import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import resumeService from '../services/resumeService';
import type { Resume } from '../types/resume';
import { useAuth } from '../hooks/useAuth';
import './ResumePage.css';

const ResumePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            setLoading(true);
            try {
                const data = await resumeService.getResume(i18n.language);
                setResume(data);
            } catch (err) {
                console.error('Failed to fetch resume:', err);
                setError(t('resume.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [i18n.language, t]);

    if (loading) return <div className="resume-status">{t('resume.loading')}</div>;
    if (error) return <div className="resume-status error">{error}</div>;
    if (!resume) return <div className="resume-status">{t('resume.noData')}</div>;

    return (
        <div className="resume-container chaos-card">
            <aside className="resume-sidebar">
                <header className="resume-header">
                    <h1>{resume.name}</h1>
                    <div className="title">Software Engineer</div>
                </header>

                <div className="contact-info">
                    <div className="contact-item">
                        <b>Email</b>
                        <div>{resume.email}</div>
                    </div>
                    <div className="contact-item">
                        <b>Phone</b>
                        <div>{resume.phone}</div>
                    </div>
                    <div className="contact-item">
                        <b>Location</b>
                        <div>{resume.location}</div>
                    </div>
                </div>

                <section className="resume-section">
                    <h2>{t('resume.summary')}</h2>
                    <p>{resume.summary}</p>
                </section>
            </aside>

            <main className="resume-main">
                <section className="resume-section">
                    <h2>{t('resume.experience')}</h2>
                    <div className="experience-list">
                        {resume.experiences.map((exp) => (
                            <div key={exp.id} className="experience-item">
                                <h3>{exp.title}</h3>
                                <div className="item-meta">
                                    {exp.company} | {exp.startDate} - {exp.endDate}
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
                                    {edu.institution} | {edu.startDate} - {edu.endDate}
                                </div>
                                <p>{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {isAuthenticated && (
                    <div className="admin-link-container">
                        <Link to="/resume/admin" className="admin-edit-link">✎ Edit Resume</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResumePage;
