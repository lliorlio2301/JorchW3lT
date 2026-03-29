import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import shortStoryService from '../services/shortStoryService';
import type { ShortStory } from '../types/shortStory';
import './ShortStoriesPage.css';

const ShortStoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const [stories, setStories] = useState<ShortStory[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="stories-status">{t('common.loading', 'Loading stories...')}</div>;

    return (
        <div className="stories-container">
            <header className="stories-header">
                <h1>{t('nav.stories', 'Short Stories')}</h1>
                <p>{t('stories.subtitle', 'A journey through fictional realms and personal narratives.')}</p>
            </header>

            <div className="stories-grid">
                {stories.map((story) => (
                    <Link to={`/stories/${story.id}`} key={story.id} className="story-card chaos-card">
                        {story.coverImageUrl && (
                            <div className="story-cover">
                                <img src={story.coverImageUrl} alt={story.title} />
                            </div>
                        )}
                        <div className="story-info">
                            <h3>{story.title}</h3>
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
