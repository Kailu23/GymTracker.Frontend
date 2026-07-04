import { Loader2 } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'small' | "medium" | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
    icon?: ReactNode
    children: ReactNode
}

const variantClasses: Record<Variant, string> = {
    primary: 'bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:bg-[var(--color-accent-hover)]',
    secondary: 'bg-[var(--color-bg-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]',
    ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-input)]',
    danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
}

const sizeClasses: Record<Size, string> = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-sm',
}

export function Button({
    variant = 'primary',
    size = 'medium',
    loading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps): import("react").JSX.Element {
    return (
        <button disabled={disabled || loading}
            className={`
            inline-flex items-center justify-center gap-2 rounded-lg font-medium
            transition-colors duration-150 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${className}
            `}
            {...props}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
            {children}
        </button>
    )
}
