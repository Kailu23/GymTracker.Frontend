import { Link } from "react-router-dom";
import { Dumbbell, TrendingUp, Zap, Shield, ChevronRight, Icon } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import { literal } from "zod";

const features = [
    { icon: Dumbbell, title: 'Follow workouts', description: 'Log sets, reps and weight.' },
    { icon: TrendingUp, title: 'Visualize progress', description: 'Graphs which show your progress over time and months.' },
    { icon: Zap, title: 'Finished plans', description: 'Choose from tens of workout plans or create your own.' },
    { icon: Shield, title: 'Work offline', description: 'PWA app - install on phone and use without internet in the gym.' },
]

const plans = [
    {
        name: 'Free', price: '0 €', period: 'Forever',
        features: ['3 workout plans', 'Basic logging', 'Weekly report'],
        cta: 'Start free', to: '/register', highlighted: false,
    },
    {
        name: 'Premium', price: '6.99 €', period: 'Monthly',
        features: ['Unlimited workout plans', 'Advanced graphs', 'Offline support', 'Priority support'],
        cta: 'Try Premium', to: '/register', highlighted: true,
    },
]

export function HomePage() {
    const isAuthenticated = useAuthStore(s => s.isAuthenticated)

    return (
        <div className="flex flex-col">

            {/* Hero */}
            <section className="flex flex-col items-center text-center px-4 py-24 gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
        bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                    <Zap size={14} />
                    Free in the beginning
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-text)] max-w-2xl leading-tight">
                    Train smarter,{' '}
                    <span className="text-[var(--color-accent)]">not harder</span>
                </h1>

                <p className="text-lg text-[var(--color-text-muted)] max-w-xl">
                    GymTracker is a PWA application for tracking training, progress and subscriptions.
                    It works on any device, even without internet.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                    {isAuthenticated ? (
                        <Link to="/dashboard">
                            <Button size="large" icon={<ChevronRight size={18} />}>
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button size="large">Start for free</Button>
                            </Link>
                            <Link to="/login">
                                <Button size="large" variant="secondary">Login</Button>
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="px-4 py-16 max-w-5xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-12">
                    All you need in one place
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="bg-[var(--color-bg-card)] border border-[var(--color-border)]
                                        rounded-xl p-6 flex flex-col gap-3
                                        hover:border-[var(--color-accent)] transition-colors duration-200">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]">
                                <Icon size={20} />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section className="px-4 py-16 max-w-3xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-12">
                    Simple prices
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {plans.map(plan => (
                        <div key={plan.name} className={`rounded-2xl p-8 flex flex-col gap-6 border
                    ${plan.highlighted
                                ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]'
                                : 'bg-[var(--color-bg-card)] border-[var(--color-border)] text-[var(--color-text)]'
                            }`}>
                            <div>
                                <p className={`text-sm font-medium mb-1 ${plan.highlighted ? 'opacity-80' : 'text-[var(--color-text-muted)]'}`}>
                                    {plan.name}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                    <span className={`text-sm ${plan.highlighted ? 'opacity-70' : 'text-[var(--color-text-muted)]'}`}>
                                        /{plan.period}
                                    </span>
                                </div>
                            </div>
                            <ul className="flex flex-col gap-2">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm">
                                        <span>✓</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to={plan.to}>
                                <Button className="w-full" variant={plan.highlighted ? 'secondary' : 'primary'}>
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
