import { createContext } from 'react';
import type { User, AuthenticationRequest } from '../types/auth';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (request: AuthenticationRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
