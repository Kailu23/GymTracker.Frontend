import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, Dumbbell, TrendingUp,
    ClipboardList, CreditCard, Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useSubscription } from "@/hooks/useSubscription";

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/plans', icon: ClipboardList, label: 'Plans' },
    { to: '/workout', icon: Dumbbell, label: 'Workout' },
    { to: '/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/subscription', icon: CreditCard, label: 'Subscriptions' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
    const user = useAuthStore(s => s.user)
    const { isPremium } = useSubscription()

    return (
        <aside className="
        w-60 shrink-0 hidden md:flex flex-col
      bg-[var(--color-bg-card)] border-r border-[var(--color-border)]
      min-h-[calc(100svh-4rem)]
        ">
        <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({to, icon:Icon, label}) => (
            <NavLink key={to}
            to={to}
            className={({isActive}) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                ? 'bg-[var(-color-accent)] text-[var(--color-accent-text)]'
                : 'text-[var(--color-text-mted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-input)]'
                }
                `}
            >
            <Icon size={18}/>
            {label}
            </NavLink>
        ))}
        </nav>

        {/* Suscription badge */}
        {user && (
            <div className="p-3 border-t border-[var(--color-border)]">
            <div className={`
                text-xs text-center py-1.5 px-3 rounded-full font-medium
                ${isPremium
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                : 'bg-[var(--color-bg-input)] text-[var(--color-text-muted)]'
                }
                `}>
                {isPremium ? 'Premium':'Free plan'}
                </div>
            </div>
        )}
        </aside>
    )
}
