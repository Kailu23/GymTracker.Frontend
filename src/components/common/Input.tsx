import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({label,error,leftIcon,className='', ...props}, ref) =>{
        return (
            <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-[var(--color-text)]">
                {label}
                </label>
            )}

            <div className="relative">
            {leftIcon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                {leftIcon}
                </span>
            )}
            <input ref={ref}
            className={`
                w-full rounded-lg px-3 py-2.5 text-sm
                bg-[var(--color-bg-input)] text-[var(--color-text)]
                border transition-colors duration-150 outline-none
                placeholder:text-[var(--color-text-muted)]
                ${error
                ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
                }
                ${leftIcon ? 'pl-9':''}
                ${className}
                `}
                {...props}
               />
            </div>
            {error && (
                <p className="text-xs text-[var(--color-danger)]">{error}</p>
            )}
            </div>
        )
    }
)

Input.displayName = 'Input'
