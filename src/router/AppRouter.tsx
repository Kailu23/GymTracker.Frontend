import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Spinner } from "@/components/common/Spinner";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";

const HomePage = () => <PlaceholderPage title="Home" />
const LoginPage = () => <PlaceholderPage title="Login" />
const RegisterPage = () => <PlaceholderPage title="Register" />
const DashboardPage = () => <PlaceholderPage title="Dashboard" />
const PlansPage = () => <PlaceholderPage title="Plans" />
const WorkoutPage = () => <PlaceholderPage title="Workout" />
const ProgressPage = () => <PlaceholderPage title="Progress" />
const SubscriptionPage = () => <PlaceholderPage title="Subscription" />
const SettingsPage = () => <PlaceholderPage title="Settings" />
const NotFoundPage = () => <PlaceholderPage title="404 - Not Found" />

function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-center h-64 text-2xl font-bold text-[var(--color-text-muted)]">
            {title}
        </div>
    )
}

// Guard components

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore()

    if (isLoading) return <Spinner fullscreen />
    if (isAuthenticated) return <Navigate to="/login" replace />

    return <>{children}</>
}

function GuestRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore()

    if (isLoading) return <Spinner fullscreen />
    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    return <>{children}</>
}
export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={
                <AppLayout showSidebar={false}>
                    <HomePage />
                </AppLayout>
            } />
            <Route path="/login" element={
                <GuestRoute>
                    <AppLayout showSidebar={false}>
                        <LoginPage />
                    </AppLayout>
                </GuestRoute>
            } />
            <Route path="/register" element={
                <GuestRoute>
                    <AppLayout showSidebar={false}>
                        <RegisterPage />
                    </AppLayout>
                </GuestRoute>
            } />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <AppLayout>
                        <DashboardPage />
                    </AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/plans" element={
                <ProtectedRoute>
                    <AppLayout>
                        <PlansPage />
                    </AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/workout" element={
                <ProtectedRoute>
                    <AppLayout>
                        <WorkoutPage />
                    </AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/progress" element={
                <ProtectedRoute>
                    <AppLayout>
                        <ProgressPage />
                    </AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/subscription" element={
                <ProtectedRoute>
                    <AppLayout>
                        <SubscriptionPage />
                    </AppLayout>
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <AppLayout>
                        <SettingsPage />
                    </AppLayout>
                </ProtectedRoute>
            } />
            <Route path="*" element={
                <AppLayout showSidebar={false}>
                    <NotFoundPage />
                </AppLayout>
            } />
        </Routes>
    )
}
