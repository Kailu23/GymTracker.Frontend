import { create } from "zustand";
import { type User } from "@/types/authTypes";

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean

    setUser: (user: User | null) => void
    setLoading:(loading: boolean)=> void
    logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),

    logout:()=>{
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({user:null, isAuthenticated:false, isLoading:false})
    },
}))
