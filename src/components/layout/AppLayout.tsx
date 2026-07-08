import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface AppLayoutProps {
    children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated)

    return (
        <div className="min-h-svh flex flex-col bg-[var(--color-bg)]">
            <Navbar />

            <div className="flex flex-1">
                {isAuthenticated && <Sidebar />}

                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
