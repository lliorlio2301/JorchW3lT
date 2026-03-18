import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import ResumePage from './pages/ResumePage';
import SongsPage from './pages/SongsPage';
import ProjectsPage from './pages/ProjectsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import NotesPage from './pages/NotesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogAdminPage from './pages/BlogAdminPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import './App.css'

function NavContent() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app-layout">
      {isOffline && (
        <div className="offline-banner">
          {t('common.offlineMode')} - {t('common.offlineDataAvailable')}
        </div>
      )}
      <nav className="main-nav">
        <div className="nav-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/projects">{t('nav.projects')}</Link>
          <Link to="/resume">{t('nav.resume')}</Link>
          <Link to="/songs">{t('nav.songs')}</Link>
          <Link to="/blog">{t('nav.blog')}</Link>
          {isAuthenticated && (
            <>
              <Link to="/shopping">{t('nav.shopping')}</Link>
              <Link to="/notes">{t('nav.notes')}</Link>
            </>
          )}
        </div>
        <div className="language-switcher">
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={() => changeLanguage('de')} className={i18n.language === 'de' ? 'active' : ''}>DE</button>
          <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
          <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
          {isAuthenticated ? (
            <button onClick={logout} className="auth-toggle">Logout</button>
          ) : (
            <Link to="/login" className="auth-toggle">Login</Link>
          )}
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={
            <div className="home-welcome">
              <h1>{t('welcome.title')}</h1>
              {/* <p>{t('welcome.subtitle')}</p> */}
            </div>
          } />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/admin" element={<BlogAdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavContent />
      </AuthProvider>
    </Router>
  )
}

export default App
