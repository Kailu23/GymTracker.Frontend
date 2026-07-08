import { useEffect } from 'react'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { clearTokens } from '@/services/api'
import axios from 'axios'

export function AuthInitializer() {
    const {setUser,setLoading}=useAuthStore()

    useEffect(()=>{
        const token=localStorage.getItem('accessToken')
        if (!token) {
            setLoading(false)
            return
        }

        authService.me()
        .then(setUser)
        .catch((err)=>{
            if (axios.isAxiosError(err) && err.response?.status===401) {
               clearTokens()
            }
            setLoading(false)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return null
}
