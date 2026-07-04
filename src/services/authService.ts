import { api } from "./api";
import { type AuthResponse, type LoginRequest, type RegisterRequest } from "@/types/authTypes";

export const authService = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/login', data).then(r => r.data),

    register: (data: RegisterRequest) =>
        api.post<AuthResponse>('/auth/register', data).then(r => r.data),

    me: () =>
        api.get<AuthResponse['user']>('/auth/me').then(r => r.data),

    logout: () =>
        api.post('/auth/logout').catch(() => { })
}
