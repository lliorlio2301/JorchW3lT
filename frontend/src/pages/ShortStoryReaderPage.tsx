import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import shortStoryService from '../services/shortStoryService';
import type { ShortStory } from '../types/shortStory';
import './ShortStoryReaderPage.css';

const ShortStoryReaderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [story, setStory] = useState<ShortStory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStory = async () => {
            if (!id) return;
            try {
                const data = await shortStoryService.getStory(parseInt(id));
                setStory(data);
            } catch (err) {
                console.error('Failed to fetch story', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    if (loading) return <div className="reader-status">{t('common.loading', 'Loading story...')}</div>;
    if (!story) return <div className="reader-status">{t('common.error', 'Story not found.')}</div>;

    return (
        <article className="reader-container">
            <header className="reader-header">
                <Link to="/stories" className="back-link">&larr; {t('common.back', 'Back to Stories')}</Link>
                {story.coverImageUrl && (
                    <div className="reader-cover">
                        <img src={story.coverImageUrl} alt={story.title} />
                    </div>
                )}
                <h1>{story.title}</h1>
                <div className="reader-meta">
                    <span className="reader-date">{new Date(story.createdAt!).toLocaleDateString()}</span>
                </div>
            </header>

            <div className="reader-content">
                <ReactMarkdown>{story.content}</ReactMarkdown>
            </div>

            <footer className="reader-footer">
                <Link to="/stories" className="retro-btn">{t('stories.readMore', 'Read more stories')}</Link>
            </footer>
        </article>
    );
};

export default ShortStoryReaderPage;
