import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ username, password, rememberMe });
            navigate('/shopping');
        } catch {
            setError(t('login.error'));
        }
    };

    return (
        <div className="login-container">
            <div className="chaos-card login-card">
                <h2>{t('login.title')}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">{t('login.username')}</label>
                        <input 
                            id="username"
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('login.password')}</label>
                        <input 
                            id="password"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group remember-me">
                        <input 
                            id="rememberMe"
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={(e) => setRememberMe(e.target.checked)} 
                        />
                        <label htmlFor="rememberMe">{t('login.rememberMe')}</label>
                    </div>
                    <button type="submit" className="login-button">{t('login.button')}</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
