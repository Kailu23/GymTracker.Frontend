import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/router/AppRouter";
import { PWAUpdatePrompt } from "@/components/common/PWAUpdatePrompt";
import { AuthInitializer } from "@/components/common/AuthInitializer"
import { useThemeStore } from "@/store/themeStore";

export default function App() {
    const theme = useThemeStore(s => s.theme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <BrowserRouter>
        <AuthInitializer/>
            <AppRouter />
            <PWAUpdatePrompt />
        </BrowserRouter>
    )
}
