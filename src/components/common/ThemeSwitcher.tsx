import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { THEMES, useThemeStore, type Theme } from "../../store/themeStore";

export function ThemeSwitcher() {
    const { theme, setTheme } = useThemeStore()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const current = THEMES.find(t => t.id === theme)

    return (
        <div ref={ref} className="relative">
            {/* Button */}
            <button onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-[var(--color-bg-card)] border border-[var(--color-border)]
                   text-[var(--color-text)] hover:border-[var(--color-accent)]
                   transition-colors duration-150 text-sm font-medium"
                aria-label="Change theme"
            >
                <Palette size={16} />
                <span>{current?.preview} {current?.label}</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl
                        bg-[var(--color-bg-card)] border border-[var(--color-border)]
                        shadow-lg overflow-hidden z-50">
                    {THEMES.map(t => (
                        <button key={t.id} onClick={() => { setTheme(t.id as Theme); setOpen(false) }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm
                          text-[var(--color-text)] hover:bg-[var(--color-bg-input)]
                          transition-colors duration-100 text-left
                          ${theme === t.id ? 'font-semibold text-[var(--color-accent)]' : ''}`}
                        >
                        <span>{t.preview}</span>
                        <span>{t.label}</span>
                        {theme === t.id && (
                            <span className="ml-auto text-[var(--color-accent)]"></span>
                        )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
