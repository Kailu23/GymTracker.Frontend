import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/common/Button";

export function OfflinePage() {
    return (
        <div className="min-h-svh flex flex-col items-center justify-center gap-6 p-4
        bg-[var(--color-bg)] text-[var(--color-text)]">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}>
                <WifiOff size={32} style={{ color: 'var(--color-accent)' }} />
            </div>

            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">No internet connection</h1>
                <p className="text-[var(--color-text-muted)]">
                    Gymtracker works offline for pages you already visiteda.
                    Check connection and try again.
                </p>
            </div>

        <Button
        icon={<RefreshCw size={16}/>}
        onClick={()=>window.location.reload()}
        >
        Try again
        </Button>
        </div>
    )
}
