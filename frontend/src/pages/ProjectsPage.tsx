import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import projectService from '../services/projectService';
import type { Project } from '../types/project';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = await projectService.getAllProjects();
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError(t('projects.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [i18n.language, t]);

    if (loading) return <div className="projects-status">{t('projects.loading')}</div>;
    if (error) return <div className="projects-status error">{error}</div>;

    return (
        <div className="projects-container">
            <h1 style={{ marginBottom: '5rem' }}>{t('projects.title')}</h1>
            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card chaos-card">
                        <div className="project-image">
                            <img src={project.imageUrl} alt={project.title} />
                        </div>
                        <div className="project-info">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="tech-tags">
                                {project.techTags.map((tag, index) => (
                                    <span key={index} className="tech-tag">#{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="project-actions">
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                                    {t('projects.github')}
                                </a>
                            )}
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-link demo">
                                    {t('projects.demo')}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && <p>{t('projects.noData')}</p>}
        </div>
    );
};

export default ProjectsPage;
