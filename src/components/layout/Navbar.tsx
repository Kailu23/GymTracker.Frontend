import { Link } from "react-router-dom";
import { Dumbbell, LogOut, User } from "lucide-react";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth()

    return (
        <header className="
            sticky top-0 z-40 h-16
            bg-[var(--color-bg-card)] border-b border-[var(--color-border)]
            backdrop-blur-sm
        ">
            <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className=" flex items-center gap-2 font-bold text-lg text-[var(--color-text)]">
                    <Dumbbell size={22} className="text-[var(--color-accent)]" />
                    GymTracker
                </Link>

                <div className="flex items-center gap-3">
                    <ThemeSwitcher />

                    {isAuthenticated ? (
                        <>
                        {/* Avatar and name */}
                            <Link to="/profile"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                        text-[var(--color-text-muted)] hover:text-[var(--color-text)]
                        hover:bg-[var(--color-bg-input)] transition-colors "
                            >
                                <User size={16} />
                                {user?.firstName}
                            </Link>

                            <Button variant="ghost" size="small" icon={<LogOut size={16} />} onClick={logout}>Log Out</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="small">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="ghost" size="small">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
