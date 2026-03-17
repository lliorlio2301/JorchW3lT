import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import projectService from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import type { Project, ProjectCreate } from '../types/project';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');

    // Admin state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectCreate | null>(null);
    const [formData, setFormData] = useState<ProjectCreate>({
        titleDe: '', titleEn: '', titleEs: '',
        descriptionDe: '', descriptionEn: '', descriptionEs: '',
        imageUrl: '', githubUrl: '', demoUrl: '',
        techTags: []
    });

    const fetchProjects = useCallback(async () => {
        try {
            const data = await projectService.getAllProjects();
            setProjects(data);
        } catch {
            setError(t('projects.error'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleEdit = async (id: number) => {
        try {
            const projectToEdit = await projectService.getProjectForEdit(id);
            setEditingProject(projectToEdit);
            setFormData(projectToEdit);
            setIsFormOpen(true);
        } catch {
            alert('Failed to load project details');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('common.confirmDelete') || 'Are you sure?')) {
            try {
                await projectService.deleteProject(id);
                setProjects(projects.filter(p => p.id !== id));
            } catch {
                alert('Failed to delete project');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject?.id) {
                await projectService.updateProject(editingProject.id, formData);
            } else {
                await projectService.saveProject(formData);
            }
            setIsFormOpen(false);
            setEditingProject(null);
            fetchProjects();
        } catch {
            alert('Failed to save project');
        }
    };

    const allTags = ['All', ...new Set(projects.flatMap(p => p.techTags))];
    const filteredProjects = filter === 'All' 
        ? projects 
        : projects.filter(p => p.techTags.includes(filter));

    if (loading) return <div className="projects-status">{t('projects.loading')}</div>;
    if (error) return <div className="projects-status error">{error}</div>;

    return (
        <div className="projects-container">
            <div className="page-header">
                <h1>{t('projects.title')}</h1>
                {isAuthenticated && (
                    <button className="btn-add" onClick={() => {
                        setIsFormOpen(!isFormOpen);
                        setEditingProject(null);
                        setFormData({
                            titleDe: '', titleEn: '', titleEs: '',
                            descriptionDe: '', descriptionEn: '', descriptionEs: '',
                            imageUrl: '', githubUrl: '', demoUrl: '',
                            techTags: []
                        });
                    }}>
                        {isFormOpen ? t('common.cancel') : '+ Add Project'}
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="chaos-card admin-form-card">
                    <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-section">
                            <h4>Titles (DE / EN / ES)</h4>
                            <div className="form-grid">
                                <input placeholder="Titel (DE)" value={formData.titleDe} onChange={e => setFormData({...formData, titleDe: e.target.value})} required />
                                <input placeholder="Title (EN)" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} required />
                                <input placeholder="Título (ES)" value={formData.titleEs} onChange={e => setFormData({...formData, titleEs: e.target.value})} required />
                            </div>
                        </div>
                        <div className="form-section">
                            <h4>Descriptions (DE / EN / ES)</h4>
                            <div className="form-grid">
                                <textarea placeholder="Beschreibung (DE)" value={formData.descriptionDe} onChange={e => setFormData({...formData, descriptionDe: e.target.value})} required />
                                <textarea placeholder="Description (EN)" value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} required />
                                <textarea placeholder="Descripción (ES)" value={formData.descriptionEs} onChange={e => setFormData({...formData, descriptionEs: e.target.value})} required />
                            </div>
                        </div>
                        <div className="form-section">
                            <h4>Media & Links</h4>
                            <div className="form-grid">
                                <input placeholder="Image URL (e.g. /projects/my-app.png)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                                <input placeholder="GitHub URL" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
                                <input placeholder="Demo URL" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-section">
                            <h4>Tags (comma separated)</h4>
                            <input 
                                placeholder="React, Spring Boot, TypeScript" 
                                value={formData.techTags.join(', ')} 
                                onChange={e => setFormData({...formData, techTags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})} 
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-save">{t('common.save')}</button>
                        </div>
                    </form>
                </div>
            )}

            {!isFormOpen && (
                <div className="filter-bar">
                    {allTags.map(tag => (
                        <button 
                            key={tag} 
                            className={`filter-tag ${filter === tag ? 'active' : ''}`}
                            onClick={() => setFilter(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="projects-grid">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="project-card chaos-card">
                        {project.imageUrl && (
                            <div className="project-image">
                                <img src={project.imageUrl} alt={project.title} />
                            </div>
                        )}
                        <div className="project-info">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="tech-tags">
                                {project.techTags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                            <div className="project-actions">
                                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
                                {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo</a>}
                                {isAuthenticated && (
                                    <div className="admin-actions">
                                        <button onClick={() => handleEdit(project.id)} className="btn-edit">✏️</button>
                                        <button onClick={() => handleDelete(project.id)} className="btn-delete">🗑️</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
