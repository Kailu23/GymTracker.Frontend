import { Link } from 'react-router-dom'
import { Dumbbell, TrendingUp, Zap, Shield, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuthStore } from '@/store/authStore'

const features = [
    { icon: Dumbbell, title: 'Track workouts', description: 'Log sets, reps and weight in real time with a built‑in timer.' },
    { icon: TrendingUp, title: 'Visualize progress', description: 'Charts showing your progress across weeks and months.' },
    { icon: Zap, title: 'Ready-made plans', description: 'Choose from dozens of training plans or create your own.' },
    { icon: Shield, title: 'Works offline', description: 'PWA app — install it on your phone and use it without internet in the gym.' },
]

const plans = [
    {
        name: 'Free', price: '0€', period: 'forever',
        features: ['3 training plans', 'Basic logging', 'Weekly overview'],
        cta: 'Start for free', to: '/register', highlighted: false,
    },
    {
        name: 'Premium', price: '6.99€', period: 'monthly',
        features: ['Unlimited plans', 'Advanced charts', 'Offline support', 'Priority support'],
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
                    <Zap size={14} /> Free to start
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-text)] max-w-2xl leading-tight">
                    Train smarter,{' '}
                    <span className="text-[var(--color-accent)]">not harder</span>
                </h1>

                <p className="text-lg text-[var(--color-text-muted)] max-w-xl">
                    GymTracker is a PWA app for tracking workouts, progress and subscriptions.
                    Works on any device, even without internet.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                    {isAuthenticated ? (
                        <Link to="/dashboard">
                            <Button size="lg" icon={<ChevronRight size={18} />}>Go to Dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/register"><Button size="lg">Start for free</Button></Link>
                            <Link to="/login"><Button size="lg" variant="secondary">Login</Button></Link>
                        </>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="px-4 py-16 max-w-5xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-12">
                    Everything you need in one place
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="bg-[var(--color-bg-card)] border border-[var(--color-border)]
                                        rounded-xl p-6 flex flex-col gap-3
                                        hover:border-[var(--color-accent)] transition-colors duration-200">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}>
                                <Icon size={20} style={{ color: 'var(--color-accent)', stroke: 'var(--color-accent)' }} />
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
                    Simple pricing
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
                                        <Check
                                            size={15}
                                            strokeWidth={2.5}
                                            style={{ color: plan.highlighted ? 'var(--color-accent-text)' : 'var(--color-accent)', flexShrink: 0 }}
                                        />
                                        {f}
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
