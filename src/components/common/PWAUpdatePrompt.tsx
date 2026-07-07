import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "./Button";

export function PWAUpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            r && setInterval(() => r.update(), 60 * 1000)
        },
    })

    if (!needRefresh) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50
            bg-[var(--color-bg-card)] border border-[var(--color-border)]
                    rounded-xl p-4 shadow-[0_8px_32px_var(--color-shadow)]
                    flex items-start gap-3">
            <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                    New version available
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Refresh the page for newest GymTracker version.
                </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Button
                    size="small"
                    icon={<RefreshCw size={14} />}
                    onClick={() => updateServiceWorker(true)}>
                    Update
                </Button>
                <button
                onClick={()=>setNeedRefresh(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Throw away"
                >
                <X size={16} />
                </button>
            </div>
        </div>
    )
}
