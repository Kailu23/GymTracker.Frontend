import { useCallback, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { clearTokens } from "@/services/api";
import type { LoginRequest, RegisterRequest } from "@/types/authTypes";

// ViewModel
//
export function useAuth() {
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading, setUser, logout: storeLogout } = useAuthStore()

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            useAuthStore.getState().setLoading(false)
            return
        }

        authService.me()
            .then(setUser)
            .catch(() => {
                clearTokens()
                useAuthStore.getState().setLoading(false)
            })
    }, [])

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
