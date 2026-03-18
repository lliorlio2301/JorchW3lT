import api from './api';
import type { AuthenticationRequest, AuthenticationResponse } from '../types/auth';

const ENDPOINT = '/auth';

export const login = async (request: AuthenticationRequest): Promise<AuthenticationResponse> => {
    const response = await api.post<AuthenticationResponse>(`${ENDPOINT}/login`, request);
    return response.data;
};
