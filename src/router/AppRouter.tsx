import { Routes, Route } from "react-router-dom";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";

function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-svh gap-8
        bg-[var(--color-bg)] text-[var(--color-text)]">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-2">GymTracker</h1>
                <p className="text-[var(--color-text-muted)]">Theme system test</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {['bg', 'card', 'accent'].map(type => (
                    <div key={type}
                        className="w-24 h-24 rounded-xl border border-[var(--color-border)]
                flex items-center justify-center text-xs font-mono"
                        style={{
                            background: type === 'accent' ? 'var(--color-accent)' : type === 'card' ? 'var(--color-bg-card)' : 'var(--color-bg)', color: type === 'accent' ? 'var(--color-accent-text)' : 'var(--color-text)',
                        }}>
                        {type}
                    </div>
                ))}
            </div>

            <ThemeSwitcher />
        </div>
    )
}

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    )
}
