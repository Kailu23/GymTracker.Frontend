import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
    firstName: z.string().min(1, 'Name is mandatory.').max(100),
    lastName: z.string().min(1, 'Surname is mandatory.').max(100),
    email: z.string().min(1, 'Email is mandatory.').email('Enter a valid email adress'),
    password: z.string().min(8, 'Minimum 8 characters').max(100),
    confirmPassword: z.string().min(1, 'Confirm password'),
}).refine(d => d.password === d.confirmPassword, {
    message: 'Password don\'t match',
    path: ['confirmPassword']
})
type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
    const { register: registerUser } = useAuth()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

    async function onSubmit(data: RegisterForm) {
        try {
            await registerUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password })
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? 'Registration failed. Try again.'
            setError('root', { message })
        }
    }

    return (
        <div className="min-h-[calc(100svh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 shadow-[0_4px_24px_var(--color-shadow)]">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">Create an account</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">Start following your workouts for free</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Name" placeholder="Johntra" autoComplete="given-name"
                                leftIcon={<User size={16} />}
                                error={errors.firstName?.message} {...register('firstName')}
                            />
                            <Input
                                label="Surname" placeholder="Volta" autoComplete="family-name"
                                error={errors.lastName?.message} {...register('lastName')}
                            />
                        </div>
                        <Input
                            label="E-mail" type="email" placeholder="johtravolta@domain.com"
                            autoComplete="email" leftIcon={<Mail size={16} />}
                            error={errors.email?.message} {...register('email')}
                        />
                        <Input
                            label="Password" type="email" placeholder="********"
                            autoComplete="new-password" leftIcon={<Lock size={16} />}
                            error={errors.password?.message} {...register('password')}
                        />
                        <Input
                            label="Confirm password" type="password" placeholder="********"
                            autoComplete="new-password" leftIcon={<Mail size={16} />}
                            error={errors.confirmPassword?.message} {...register('confirmPassword')}
                        />
                        {errors.root && (
                            <p className="text-sm text-[var(--color-danger)] text-center bg-[var(--color-danger)]/10 rounded-lg px-3 py-2">
                                {errors.root.message}
                            </p>
                        )}
                        <Button type="submit" size="large" loading={isSubmitting} className="w-full mt-2">
                            Create account
                        </Button>
                    </form>
                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
