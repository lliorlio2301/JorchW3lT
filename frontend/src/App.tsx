import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import ResumePage from './pages/ResumePage';
import SongsPage from './pages/SongsPage';
import ProjectsPage from './pages/ProjectsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import './App.css'

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div className="app-layout">
        <nav className="main-nav">
          <div className="nav-links">
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/projects">{t('nav.projects')}</Link>
            <Link to="/resume">{t('nav.resume')}</Link>
            <Link to="/songs">{t('nav.songs')}</Link>
            <Link to="/shopping">{t('nav.shopping')}</Link>
          </div>
          <div className="language-switcher">
            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => changeLanguage('de')} className={i18n.language === 'de' ? 'active' : ''}>DE</button>
            <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
            <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={
              <div className="home-welcome">
                <h1>{t('welcome.title')}</h1>
                <p>{t('welcome.subtitle')}</p>
              </div>
            } />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/songs" element={<SongsPage />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
