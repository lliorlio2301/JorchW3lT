import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import resumeService from '../services/resumeService';
import type { ResumeFull, ExperienceFull, EducationFull } from '../types/resume';
import { useAuth } from '../hooks/useAuth';
import './AdminResumePage.css';

const AdminResumePage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [resume, setResume] = useState<ResumeFull | null>(null);
    const [activeLang, setActiveLang] = useState<'de' | 'en' | 'es'>('de');
    const [loading, setLoading] = useState(true);

    const createEmptyResume = (): ResumeFull => ({
        name: '',
        email: '',
        phone: '',
        locationDe: '',
        locationEn: '',
        locationEs: '',
        summaryDe: '',
        summaryEn: '',
        summaryEs: '',
        experiences: [],
        education: []
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const fetchResume = async () => {
        try {
            const data = await resumeService.getFullResume();
            setResume(data);
        } catch (err) {
            console.error('Failed to fetch resume', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResume();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resume) return;

        try {
            const saved = await resumeService.saveResume(resume);
            setResume(saved);
            alert(t('common.saveSuccess', 'Gespeichert!'));
        } catch (err) {
            console.error('Failed to save resume', err);
            alert(t('common.saveError', 'Fehler beim Speichern.'));
        }
    };

    // Experience Handlers
    const addExperience = () => {
        if (!resume) return;
        const newExp: ExperienceFull = {
            titleDe: '', titleEn: '', titleEs: '',
            company: '',
            locationDe: '', locationEn: '', locationEs: '',
            startDate: '', endDate: '',
            descriptionDe: '', descriptionEn: '', descriptionEs: ''
        };
        setResume({ ...resume, experiences: [...resume.experiences, newExp] });
    };

    const removeExperience = (index: number) => {
        if (!resume) return;
        const updated = [...resume.experiences];
        updated.splice(index, 1);
        setResume({ ...resume, experiences: updated });
    };

    // Education Handlers
    const addEducation = () => {
        if (!resume) return;
        const newEdu: EducationFull = {
            degreeDe: '', degreeEn: '', degreeEs: '',
            institution: '',
            locationDe: '', locationEn: '', locationEs: '',
            startDate: '', endDate: '',
            descriptionDe: '', descriptionEn: '', descriptionEs: ''
        };
        setResume({ ...resume, education: [...resume.education, newEdu] });
    };

    const removeEducation = (index: number) => {
        if (!resume) return;
        const updated = [...resume.education];
        updated.splice(index, 1);
        setResume({ ...resume, education: updated });
    };

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <div className="admin-resume-container">
                <p>{t('resume.loading')}</p>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="admin-resume-container">
                <div className="chaos-card resume-empty-state">
                    <h1>{t('resume.adminTitle', 'Resume Admin')}</h1>
                    <p>{t('resume.noData')}</p>
                    <button className="create-btn" onClick={() => setResume(createEmptyResume())}>
                        {t('resume.createFirst', 'Lebenslauf anlegen')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-resume-container">
            <header className="admin-header">
                <h1>{t('resume.adminTitle', 'Resume Admin')}</h1>
                <div className="lang-tabs">
                    <button className={activeLang === 'de' ? 'active' : ''} onClick={() => setActiveLang('de')}>DE</button>
                    <button className={activeLang === 'en' ? 'active' : ''} onClick={() => setActiveLang('en')}>EN</button>
                    <button className={activeLang === 'es' ? 'active' : ''} onClick={() => setActiveLang('es')}>ES</button>
                </div>
            </header>

            <form onSubmit={handleSave} className="resume-form">
                {/* General Info */}
                <section className="chaos-card form-section">
                    <h2>{t('resume.generalInfo', 'Allgemeine Info')}</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input value={resume.name} onChange={e => setResume({...resume, name: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input value={resume.email} onChange={e => setResume({...resume, email: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input value={resume.phone} onChange={e => setResume({...resume, phone: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Location ({activeLang.toUpperCase()})</label>
                            {activeLang === 'de' && <input value={resume.locationDe} onChange={e => setResume({...resume, locationDe: e.target.value})} />}
                            {activeLang === 'en' && <input value={resume.locationEn} onChange={e => setResume({...resume, locationEn: e.target.value})} />}
                            {activeLang === 'es' && <input value={resume.locationEs} onChange={e => setResume({...resume, locationEs: e.target.value})} />}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Summary ({activeLang.toUpperCase()})</label>
                        {activeLang === 'de' && <textarea value={resume.summaryDe} onChange={e => setResume({...resume, summaryDe: e.target.value})} rows={4} />}
                        {activeLang === 'en' && <textarea value={resume.summaryEn} onChange={e => setResume({...resume, summaryEn: e.target.value})} rows={4} />}
                        {activeLang === 'es' && <textarea value={resume.summaryEs} onChange={e => setResume({...resume, summaryEs: e.target.value})} rows={4} />}
                    </div>
                </section>

                {/* Experience */}
                <section className="chaos-card form-section">
                    <div className="section-header">
                        <h2>{t('resume.experience', 'Erfahrung')}</h2>
                        <button type="button" className="add-btn" onClick={addExperience}>+ Add</button>
                    </div>
                    {resume.experiences.map((exp, idx) => (
                        <div key={idx} className="list-item-editor">
                            <div className="item-header">
                                <h3>#{idx + 1} {exp.company}</h3>
                                <button type="button" className="remove-btn" onClick={() => removeExperience(idx)}>&times;</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Company</label>
                                    <input value={exp.company} onChange={e => {
                                        const updated = [...resume.experiences];
                                        updated[idx].company = e.target.value;
                                        setResume({...resume, experiences: updated});
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>Title ({activeLang.toUpperCase()})</label>
                                    <input value={activeLang === 'de' ? exp.titleDe : activeLang === 'en' ? exp.titleEn : exp.titleEs} onChange={e => {
                                        const updated = [...resume.experiences];
                                        if (activeLang === 'de') updated[idx].titleDe = e.target.value;
                                        else if (activeLang === 'en') updated[idx].titleEn = e.target.value;
                                        else updated[idx].titleEs = e.target.value;
                                        setResume({...resume, experiences: updated});
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input value={exp.startDate} onChange={e => {
                                        const updated = [...resume.experiences];
                                        updated[idx].startDate = e.target.value;
                                        setResume({...resume, experiences: updated});
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input value={exp.endDate} onChange={e => {
                                        const updated = [...resume.experiences];
                                        updated[idx].endDate = e.target.value;
                                        setResume({...resume, experiences: updated});
                                    }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description ({activeLang.toUpperCase()})</label>
                                <textarea value={activeLang === 'de' ? exp.descriptionDe : activeLang === 'en' ? exp.descriptionEn : exp.descriptionEs} onChange={e => {
                                    const updated = [...resume.experiences];
                                    if (activeLang === 'de') updated[idx].descriptionDe = e.target.value;
                                    else if (activeLang === 'en') updated[idx].descriptionEn = e.target.value;
                                    else updated[idx].descriptionEs = e.target.value;
                                    setResume({...resume, experiences: updated});
                                }} rows={3} />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Education */}
                <section className="chaos-card form-section">
                    <div className="section-header">
                        <h2>{t('resume.education', 'Ausbildung')}</h2>
                        <button type="button" className="add-btn" onClick={addEducation}>+ Add</button>
                    </div>
                    {resume.education.map((edu, idx) => (
                        <div key={idx} className="list-item-editor">
                            <div className="item-header">
                                <h3>#{idx + 1} {edu.institution}</h3>
                                <button type="button" className="remove-btn" onClick={() => removeEducation(idx)}>&times;</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Institution</label>
                                    <input value={edu.institution} onChange={e => {
                                        const updated = [...resume.education];
                                        updated[idx].institution = e.target.value;
                                        setResume({...resume, education: updated});
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>Degree ({activeLang.toUpperCase()})</label>
                                    <input value={activeLang === 'de' ? edu.degreeDe : activeLang === 'en' ? edu.degreeEn : edu.degreeEs} onChange={e => {
                                        const updated = [...resume.education];
                                        if (activeLang === 'de') updated[idx].degreeDe = e.target.value;
                                        else if (activeLang === 'en') updated[idx].degreeEn = e.target.value;
                                        else updated[idx].degreeEs = e.target.value;
                                        setResume({...resume, education: updated});
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input value={edu.startDate} onChange={e => {
                                        const updated = [...resume.education];
                                        updated[idx].startDate = e.target.value;
                                        setResume({...resume, education: updated});
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input value={edu.endDate} onChange={e => {
                                        const updated = [...resume.education];
                                        updated[idx].endDate = e.target.value;
                                        setResume({...resume, education: updated});
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="sticky-actions chaos-card">
                    <button type="submit" className="save-btn">{t('common.save')}</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/resume')}>{t('common.cancel')}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminResumePage;
