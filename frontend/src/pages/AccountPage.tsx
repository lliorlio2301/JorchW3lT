import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import './AccountPage.css';

const AccountPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.updateUsername(newUsername);
            setMessage({ text: t('account.usernameSuccess', 'Benutzername erfolgreich aktualisiert. Bitte logge dich neu ein.'), type: 'success' });
            setTimeout(() => logout(), 2000);
        } catch (err: any) {
            setMessage({ text: err.response?.data || 'Fehler beim Aktualisieren', type: 'error' });
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: t('account.passwordMismatch', 'Passwörter stimmen nicht überein'), type: 'error' });
            return;
        }
        try {
            await userService.updatePassword(newPassword);
            setMessage({ text: t('account.passwordSuccess', 'Passwort erfolgreich aktualisiert. Bitte logge dich neu ein.'), type: 'success' });
            setTimeout(() => logout(), 2000);
        } catch (err: any) {
            setMessage({ text: err.response?.data || 'Fehler beim Aktualisieren', type: 'error' });
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="account-container">
            <h1>{t('account.title', 'Account Verwaltung')}</h1>
            
            {message && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="account-grid">
                {/* Username Change */}
                <div className="module-panel account-card">
                    <h3>{t('account.changeUsername', 'Benutzername ändern')}</h3>
                    <p className="current-user-info">Aktueller Benutzer: <strong>{user?.username}</strong></p>
                    <form onSubmit={handleUpdateUsername} className="account-form">
                        <input 
                            type="text" 
                            placeholder={t('account.newUsername', 'Neuer Benutzername')}
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-save" data-testid="save-username-btn">{t('common.save')}</button>
                    </form>
                </div>

                {/* Password Change */}
                <div className="module-panel account-card">
                    <h3>{t('account.changePassword', 'Passwort ändern')}</h3>
                    <form onSubmit={handleUpdatePassword} className="account-form">
                        <input 
                            type="password" 
                            placeholder={t('account.newPassword', 'Neues Passwort')}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                        <input 
                            type="password" 
                            placeholder={t('account.confirmPassword', 'Passwort bestätigen')}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-save" data-testid="save-password-btn">{t('common.save')}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
