import axios from 'axios';
import type { AuthenticationRequest, AuthenticationResponse } from '../types/auth';

const API_URL = '/api/auth';

export const login = async (request: AuthenticationRequest): Promise<AuthenticationResponse> => {
    const response = await axios.post<AuthenticationResponse>(`${API_URL}/login`, request);
    return response.data;
};
