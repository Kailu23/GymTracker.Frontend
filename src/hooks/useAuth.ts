import { useCallback } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest } from "@/types/authTypes";

// ViewModel

export function useAuth() {
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading, setUser, logout: storeLogout } = useAuthStore()

    const login = useCallback(async (data: LoginRequest) => {
        const response = await authService.login(data)
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        setUser(response.user)
        navigate('/dashboard')
    }, [navigate, setUser])

    const register = useCallback(async (data: RegisterRequest) => {
        const response = await authService.register(data)
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        setUser(response.user)
        navigate('/dashboard')
    }, [navigate, setUser])

    const logout = useCallback(async () => {
        await authService.logout()
        storeLogout()
        navigate('/login')
    }, [navigate, storeLogout])

    const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
        const updated = await authService.updateProfile(data)
        setUser(updated)
        return updated
    }, [setUser])

    const changePassword = useCallback(async (data: ChangePasswordRequest) => {
        await authService.changePassword(data)
    }, [])

    return { user, isAuthenticated, isLoading, login, register, logout, updateProfile, changePassword }
}
