import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import projectService from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import type { Project } from '../types/project';
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
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<Project>({
        title: '',
        description: '',
        imageUrl: '',
        githubUrl: '',
        demoUrl: '',
        techTags: []
    });
    // Local state for tags input string
    const [tagsInput, setTagsInput] = useState('');

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
            setTagsInput(projectToEdit.techTags.join(', '));
            setIsFormOpen(true);
        } catch {
            alert('Failed to load project details');
        }
    };

    const handleDelete = async () => {
        if (!editingProject?.id) return;
        if (window.confirm(t('common.confirmDelete') || 'Are you sure?')) {
            try {
                await projectService.deleteProject(editingProject.id);
                setIsFormOpen(false);
                setEditingProject(null);
                fetchProjects();
            } catch {
                alert('Failed to delete project');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Finalize tags before submitting
        const finalTags = tagsInput.split(',')
            .map(t => t.trim())
            .filter(t => t !== '');
        
        const dataToSave = { ...formData, techTags: finalTags };

        try {
            if (editingProject?.id) {
                await projectService.updateProject(editingProject.id, dataToSave);
            } else {
                await projectService.saveProject(dataToSave);
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
                        setTagsInput('');
                        setFormData({
                            title: '',
                            description: '',
                            imageUrl: '',
                            githubUrl: '',
                            demoUrl: '',
                            techTags: []
                        });
                    }}>
                        {isFormOpen ? t('common.cancel') : '+ Add Project'}
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="module-panel admin-form-card">
                    <h3>{editingProject?.id ? 'Edit Project' : 'Add New Project'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-section">
                            <div className="form-grid">
                                <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                        </div>
                        <div className="form-section">
                            <div className="form-grid">
                                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
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
                                value={tagsInput} 
                                onChange={e => setTagsInput(e.target.value)} 
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-save">{t('common.save')}</button>
                            {editingProject?.id && (
                                <button type="button" className="btn-delete-final" onClick={handleDelete}>
                                    {t('common.delete')}
                                </button>
                            )}
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
                    <div key={project.id} className="project-card module-panel">
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
                                <div className="external-links">
                                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
                                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo</a>}
                                </div>
                                {isAuthenticated && (
                                    <div className="admin-controls">
                                        <button onClick={() => project.id && handleEdit(project.id)} className="btn-edit">{t('common.edit')}</button>
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
