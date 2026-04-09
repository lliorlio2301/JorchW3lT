import React, { useState, useEffect, type ReactNode } from 'react';
import type { User, AuthenticationRequest } from '../types/auth';
import * as authService from '../services/authService';
import api from '../services/api';
import { AuthContext } from './AuthContext';

const decodeToken = (token: string): User | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return { username: payload.sub || payload.username };
    } catch (e) {
        console.error('Failed to decode token', e);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            const decodedUser = decodeToken(token);
            if (decodedUser) {
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                if (!user) {
                    setUser(decodedUser);
                }
            } else {
                // Token is present but invalid/undecodable
                setToken(null);
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            delete api.defaults.headers.common['Authorization'];
            if (user) {
                setUser(null);
            }
        }
    }, [token, user]);

    const login = async (request: AuthenticationRequest) => {
        try {
            const response = await authService.login(request);
            setToken(response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
