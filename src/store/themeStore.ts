import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = 'system' | 'light' | 'dark' | 'neon' | 'iron' | 'arctic'

export const THEMES: { id: Theme; label: string }[] =
    [
        { id: 'system', label: 'System' },
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
        { id: 'neon', label: 'Neon' },
        { id: 'iron', label: 'Iron' },
        { id: 'arctic', label: 'Arctic' },
    ]

interface ThemeStore {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: 'system',
            setTheme: (theme) => {
                document.documentElement.setAttribute('data-theme', theme)
                set({ theme })
            },
        }),
        {
            name: 'gym-theme',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.setAttribute('data-theme', state.theme)
                }
            },
        }
    )
)
