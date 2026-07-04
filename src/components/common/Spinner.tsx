import { Loader2 } from "lucide-react"

interface SpinnerProps {
    size?: number
    fullscreen?: boolean
}

export function Spinner({ size = 24, fullscreen = false}:SpinnerProps) {
    if (fullscreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg)]">
            <Loader2 size={size} className="animate-spin text-[var(--color-accent)]" />
            </div>
        )
    }

    return <Loader2 size={size} className="animate-spin text-[var(--color-accent)]" />
}
