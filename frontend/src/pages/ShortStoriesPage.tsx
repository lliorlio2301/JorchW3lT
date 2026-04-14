import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import shortStoryService from '../services/shortStoryService';
import { useAuth } from '../hooks/useAuth';
import type { ShortStory } from '../types/shortStory';
import './ShortStoriesPage.css';

const ShortStoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [stories, setStories] = useState<ShortStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await shortStoryService.getAllStories();
                setStories(data);
            } catch (err) {
                console.error('Failed to fetch stories', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

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

    const allTags = Array.from(new Set(stories.flatMap(story => story.tags || [])));
    const filteredStories = selectedTags.length === 0 
        ? stories 
        : stories.filter(story => selectedTags.some(tag => story.tags?.includes(tag)));

    if (loading) return <div className="stories-status">{t('common.loading', 'Loading stories...')}</div>;

    return (
        <div className="stories-container">
            <header className="stories-header">
                <div className="header-with-action">
                    <h1>{t('nav.stories', 'Short Stories')}</h1>
                    {isAuthenticated && (
                        <Link to="/stories/admin" className="admin-link">
                            {t('stories.adminTitle', 'Manage')}
                        </Link>
                    )}
                </div>
                <p>{t('stories.subtitle', 'A journey through fictional realms and personal narratives.')}</p>
            </header>

            {allTags.length > 0 && (
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
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="stories-grid">
                {filteredStories.map((story) => (
                    <Link to={`/stories/${story.id}`} key={story.id} className="story-card chaos-card">
                        {story.coverImageUrl && (
                            <div className="story-cover">
                                <img src={story.coverImageUrl} alt={story.coverImageAlt || story.title} />
                            </div>
                        )}
                        <div className="story-info">
                            <h3>{story.title}</h3>
                            <div className="entry-tags" style={{marginBottom: '1rem'}}>
                                {story.tags?.map(tag => (
                                    <span key={tag} className="tag">#{tag}</span>
                                ))}
                            </div>
                            {story.summary && <p className="story-summary">{story.summary}</p>}
                            <span className="story-date">{new Date(story.createdAt!).toLocaleDateString()}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {stories.length === 0 && <p className="no-data">{t('stories.empty', 'No stories available yet.')}</p>}
        </div>
    );
};

export default ShortStoriesPage;
