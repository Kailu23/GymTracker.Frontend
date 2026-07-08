import { useCallback, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { clearTokens } from "@/services/api";
import type { LoginRequest, RegisterRequest } from "@/types/authTypes";

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

    return { user, isAuthenticated, isLoading, login, register, logout }
}
