import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
    email: z.string().min(1, 'E-mail  is mandatory.').email('Enter a valid e-mail adress'),
    password: z.string().min(1, 'Password is mandatory.').min(8, 'Minimum 8 characters'),
})
type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
    const { login } = useAuth()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

    async function onSubmit(data: LoginForm) {
        try {
            await login(data)
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Login unsuccessful. Try again."
            setError('root', { message })
        }
    }

    return (
        <div className="min-h-[calc(100svh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 shadow-[0_4px_24px_var(--color-shadow)]">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">Welcome back</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">Log in to your GymTracker account.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                        <Input label="E-mail" type="email" placeholder="your@email.com"
                            autoComplete="email" leftIcon={<Mail size={16} />}
                            error={errors.email?.message} {...register('email')}
                        />
                        <Input label="Password" type="password" placeholder="*******"
                            autoComplete="current-password" leftIcon={<Lock size={16} />}
                            error={errors.password?.message} {...register('password')}
                        />
                        {errors.root && (
                            <p className="text-sm text-[var(--color-danger)] text-center bg-[var(--color-danger)]/10 rounded-lg px-3 py-2">
                                {errors.root?.message}
                            </p>
                        )}
                        <Button type="submit" size="large" loading={isSubmitting} className="w-full mt-2">
                            Login
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[var(--color-accent)] hover:underline font-medium">
                            Register now!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
