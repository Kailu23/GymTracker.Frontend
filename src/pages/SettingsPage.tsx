import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { User, Mail, Lock, Palette, LogOut } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { useAuth } from "@/hooks/useAuth";

function extractErrorMessage(error: unknown, fallback: string) {
    return (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? fallback
}

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[var(--color-text)] font-semibold">
                {icon}
                {title}
            </div>
            {children}
        </div>
    )
}

const profileSchema = z.object({
    firstName: z.string().min(1, 'Name is mandatory.').max(100),
    lastName: z.string().min(1, 'Surname is mandatory.').max(100),
    email: z.string().min(1, 'Email is mandatory.').email('Enter a valid email address'),
})
type ProfileForm = z.infer<typeof profileSchema>

function ProfileSection() {
    const { user, updateProfile } = useAuth()
    const [savedMessage, setSavedMessage] = useState<string | null>(null)

    const {
        register, handleSubmit, setError,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            email: user?.email ?? '',
        },
    })

    async function onSubmit(data: ProfileForm) {
        setSavedMessage(null)
        try {
            await updateProfile(data)
            setSavedMessage('Profile updated successfully.')
        } catch (error: unknown) {
            setError('root', { message: extractErrorMessage(error, 'Could not update profile. Try again.') })
        }
    }

    return (
        <SectionCard title="Profile" icon={<User size={18} />}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Name" error={errors.firstName?.message} {...register('firstName')} />
                    <Input label="Surname" error={errors.lastName?.message} {...register('lastName')} />
                </div>
                <Input
                    label="Email" type="email" leftIcon={<Mail size={16} />}
                    error={errors.email?.message} {...register('email')}
                />

                {errors.root && <p className="text-sm text-[var(--color-danger)]">{errors.root.message}</p>}
                {savedMessage && !isDirty && <p className="text-sm text-[var(--color-success)]">{savedMessage}</p>}

                <div>
                    <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                        Save changes
                    </Button>
                </div>
            </form>
        </SectionCard>
    )
}

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z.string().min(8, 'Minimum 8 characters').max(100),
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
}).refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
})
type PasswordForm = z.infer<typeof passwordSchema>

function PasswordSection() {
    const { changePassword } = useAuth()
    const [savedMessage, setSavedMessage] = useState<string | null>(null)

    const {
        register, handleSubmit, reset, setError,
        formState: { errors, isSubmitting }
    } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

    async function onSubmit(data: PasswordForm) {
        setSavedMessage(null)
        try {
            await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
            setSavedMessage('Password changed successfully.')
            reset()
        } catch (error: unknown) {
            setError('root', { message: extractErrorMessage(error, 'Could not change password. Check your current password and try again.') })
        }
    }

    return (
        <SectionCard title="Password" icon={<Lock size={18} />}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <Input
                    label="Current password" type="password"
                    error={errors.currentPassword?.message} {...register('currentPassword')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="New password" type="password"
                        error={errors.newPassword?.message} {...register('newPassword')}
                    />
                    <Input
                        label="Confirm new password" type="password"
                        error={errors.confirmPassword?.message} {...register('confirmPassword')}
                    />
                </div>

                {errors.root && <p className="text-sm text-[var(--color-danger)]">{errors.root.message}</p>}
                {savedMessage && <p className="text-sm text-[var(--color-success)]">{savedMessage}</p>}

                <div>
                    <Button type="submit" loading={isSubmitting}>
                        Change password
                    </Button>
                </div>
            </form>
        </SectionCard>
    )
}

function AppearanceSection() {
    return (
        <SectionCard title="Appearance" icon={<Palette size={18} />}>
            <p className="text-sm text-[var(--color-text-muted)]">Choose how GymTracker looks on your device.</p>
            <div>
                <ThemeSwitcher />
            </div>
        </SectionCard>
    )
}

function AccountSection() {
    const { logout } = useAuth()
    return (
        <SectionCard title="Account" icon={<LogOut size={18} />}>
            <p className="text-sm text-[var(--color-text-muted)]">Sign out of your account on this device.</p>
            <div>
                <Button variant="danger" icon={<LogOut size={16} />} onClick={logout}>
                    Log out
                </Button>
            </div>
        </SectionCard>
    )
}

export function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
                <p className="text-[var(--color-text-muted)] mt-1">Manage your account and preferences</p>
            </div>

            <ProfileSection />
            <PasswordSection />
            <AppearanceSection />
            <AccountSection />
        </div>
    )
}
