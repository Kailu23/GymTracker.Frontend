import { api } from "./api";
import { type AuthResponse, type LoginRequest, type RegisterRequest, type UpdateProfileRequest, type ChangePasswordRequest } from "@/types/authTypes";

export const authService = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/login', data).then(r => r.data),

    register: (data: RegisterRequest) =>
        api.post<AuthResponse>('/auth/register', data).then(r => r.data),

    me: () =>
        api.get<AuthResponse['user']>('/auth/me').then(r => r.data),

    logout: () =>
        api.post('/auth/logout').catch(() => { }),

    updateProfile: (data: UpdateProfileRequest) =>
        api.put<AuthResponse['user']>('/auth/profile', data).then(r => r.data),

    changePassword: (data: ChangePasswordRequest) =>
        api.post('/auth/change-password', data),
}
