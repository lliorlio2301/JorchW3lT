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
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Admin state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<Project>({
        title: '',
        description: '',
        imageUrl: '',
        imageAlt: '',
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert(t('blog.fileTooLarge', 'Datei zu groß. Das Limit liegt bei 5 MB.'));
            return;
        }

        try {
            const url = await projectService.uploadImage(file);
            setFormData({ ...formData, imageUrl: url });
        } catch (err) {
            console.error('Upload failed', err);
            alert('Image upload failed');
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

    const toggleTag = (tag: string | null) => {
        if (tag === null) {
            setSelectedTags([]);
        } else {
            setSelectedTags(prev => 
                prev.includes(tag) 
                    ? prev.filter(t => t !== tag) 
                    : [...prev, tag]
            );
        }
    };

    const allTags = Array.from(new Set(projects.flatMap(p => p.techTags)));
    const filteredProjects = selectedTags.length === 0 
        ? projects 
        : projects.filter(p => selectedTags.some(tag => p.techTags.includes(tag)));

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
                            imageAlt: '',
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
                                <div className="image-upload-group">
                                    <label className="btn-edit" style={{ display: 'inline-block', cursor: 'pointer', marginBottom: '1rem' }}>
                                        {t('blog.uploadImage', 'Bild hochladen')}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                                    </label>
                                    {formData.imageUrl && (
                                        <div className="project-image-preview" style={{ marginBottom: '1rem', maxWidth: '200px' }}>
                                            <img src={formData.imageUrl} alt={formData.imageAlt || formData.title || 'Preview'} style={{ width: '100%', borderRadius: '4px' }} />
                                            <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Entfernen</button>
                                        </div>
                                    )}
                                </div>
                                <input placeholder="Image alt text" value={formData.imageAlt || ''} onChange={e => setFormData({...formData, imageAlt: e.target.value})} />
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
                    <button 
                        className={`filter-tag ${selectedTags.length === 0 ? 'active' : ''}`}
                        onClick={() => toggleTag(null)}
                    >
                        {t('common.all', 'All')}
                    </button>
                    {allTags.map(tag => (
                        <button 
                            key={tag} 
                            className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                            onClick={() => toggleTag(tag)}
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
                                <img src={project.imageUrl} alt={project.imageAlt || project.title} />
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
