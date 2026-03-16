import React, { useState, useEffect, type ReactNode } from 'react';
import type { User, AuthenticationRequest } from '../types/auth';
import * as authService from '../services/authService';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if (!user) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser({ username: 'admin' });
            }
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            if (user) {
                setUser(null);
            }
        }
    }, [token, user]);

    const login = async (request: AuthenticationRequest) => {
        try {
            const response = await authService.login(request);
            setToken(response.token);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
