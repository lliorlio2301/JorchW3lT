export interface AuthenticationRequest {
    username: string;
    password: string;
}

export interface AuthenticationResponse {
    token: string;
}

export interface User {
    username: string;
}
