import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthenticationRequest } from '../types/auth';
import * as authService from '../services/authService';
import axios from 'axios';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (request: AuthenticationRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Setup axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // For now, we just set a dummy user since we don't have a /me endpoint yet
            setUser({ username: 'admin' }); 
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
