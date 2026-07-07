import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'

try {
    const raw = localStorage.getItem('gym-theme')
    const theme = raw ? JSON.parse(raw)?.state?.theme??'system':'system'
    document.documentElement.setAttribute('data-theme', theme)

} catch {
    document.documentElement.setAttribute('data-theme', 'system')
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
