import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Zap, AlertCircle, ExternalLink } from "lucide-react";
import type { SubscriptionPlan } from "@/types/subscriptionTypes";
import { Button } from "@/components/common/Button";
import { useSubscription } from "@/hooks/useSubscription";
import { Spinner } from "@/components/common/Spinner";

const PLANS: SubscriptionPlan[] = [
    {
        id: import.meta.env.VITE_STRIPE_PRICE_MONTHLY ?? 'price_monthly',
        name: 'Premium monthly',
        interval: 'month',
        priceInEur: 6.99,
        features: [
            'Unlimited training plans',
            'Advanced Progress Graphs',
            'Offline Support (PWA)',
            'Priority Support',
            'Cancel anytime',
        ],
    },
    {
        id: import.meta.env.VITE_STRIPE_PRICE_YEARLY ?? 'price_yearly',
        name: 'Premium yearly',
        interval: 'year',
        priceInEur: 59.99,
        features: [
            "Everything from the monthly plan",
            'Save ~29% per year',
            'Priority access to new features',
        ],
    },
]

interface PlanCardProps {
    plan: SubscriptionPlan
    isCurrentPlan: boolean
    isPremium: boolean
    onSelect: (priceId: string) => void
    loading: boolean
}

function PlanCard({ plan, isCurrentPlan, isPremium, onSelect, loading }: PlanCardProps) {
    const isYearly = plan.interval === 'year'

    return (
        <div className={`relative rounded-2xl p-8 flex flex-col gap-6 border transition-colors
        ${isYearly
                ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]'
                : 'bg[var(--color-bg-carrd)] border-[var(--color-border)] text[var(--color-text)]'
            }`}>
            {isYearly && (
                <div className="absolute -top-3 -left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold
            bg-[var(--color-bg-card)] text-[var(--color-accent)]">
                    Most popular
                </div>
            )}

            <div>
                <p className={`text-sm font-medium mb-2 ${isYearly ? 'opacity-80' : 'text-[var(--color-text-muted)]'}`}>
                    {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.priceInEur} €</span>
                    <span className={`text-sm ${isYearly ? 'opacity-70' : 'text-[var(--color-text-muted)]'}`}>
                        / {plan.interval === 'month' ? 'm' : 'y'}
                    </span>
                </div>
                {isYearly && (
                    <p className="text-xs mt-1 opacity-75">
                        = {(plan.priceInEur / 12).toFixed(2)} € / month
                    </p>
                )}
            </div>
            <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={15} strokeWidth={2.5} style={{
                            flexShrink: 0, marginTop: 2,
                            color: isYearly ? 'var(--color-accent-text)' : 'var(--color-accent)'
                        }}
                        />
                        {f}
                    </li>
                ))}
            </ul>

            {isCurrentPlan ? (
                <Button variant="secondary" disabled className="w-full">
                    Current plan
                </Button>
            ) : (
                <Button variant={isYearly ? 'secondary' : 'primary'}
                    loading={loading}
                    className="w-full"
                    onClick={() => onSelect(plan.id)}
                    icon={<Zap size={16} />}
                >
                    {isPremium ? 'Change plan' : 'Choose plan'}
                </Button>
            )}
        </div>
    )
}

function StatusBanner({ label, color }: { label: string, color: 'success' | 'warning' | 'danger' }) {
    const colors = {
        success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20',
        warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        danger: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20',
    }

    return (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${colors[color]}`}>
            <AlertCircle size={16} />
            {label}
        </div>
    )
}

export function SubscriptionPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        subscription, isLoading, error,
        actionLoading, isPremium,
        startCheckout, openPortal, cancelSubscription,
        refetchSubscription
    } = useSubscription()

    useEffect(() => {
        if (searchParams.has('success') || searchParams.has('canceled')) {
            const timeout = setTimeout(() => setSearchParams({}), 11_000)
            return () => clearTimeout(timeout)
        }
    }, [searchParams, setSearchParams])

    const justSucceededParam = searchParams.get('success') === 'true'

    useEffect(() => {
        if (!justSucceededParam || isPremium) return

        // Webhook can take a moment to arrive after the checkout redirect —
        // poll a few times before giving up and showing a "still processing" state.
        let attempts = 0
        const interval = setInterval(() => {
            attempts += 1
            refetchSubscription()
            if (attempts >= 5) clearInterval(interval)
        }, 2000)

        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [justSucceededParam, isPremium])

    if (isLoading) return <Spinner />

    if (error) return <p className="text-[var(--color-danger)]">{error}</p>

    const justSucceeded = justSucceededParam&&isPremium
    const stillProcessing = justSucceededParam && !isPremium
    const justCanceled = searchParams.get('canceled') === 'true'

    const currentPriceId = isPremium ? subscription?.interval === 'month' ? PLANS[0].id : PLANS[1].id : null

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Subscription</h1>
                <p className="text-[var(--color-text-muted)] mt-1">
                    Control your GymTracker Premium subscription
                </p>
            </div>
            {/* Stripe redirect */}
            {justSucceeded && (
                 <StatusBanner color="success" label="The subscription has been successfully activated! Welcome to Premium."/>)}
            {stillProcessing && (
                 <StatusBanner color="warning" label="Payment received — activating your subscription, this can take a few seconds..."/>)}
                 {justCanceled && (
                     <StatusBanner color="warning" label="The payment has been cancelled. You can try again when you're ready."/>
                 )}

            {/* Current status */}
            {isPremium && subscription && (
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold text-[var(--color-text)]">
                            Premium {subscription.interval === 'month' ? 'Monthly' : 'Yearly'}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                            {subscription.cancelAtPeriodEnd
                                ? `Cancels on ${new Date(subscription.currentPeriodEnd!).toLocaleDateString('hr-HR')}`
                                : `Renews on ${new Date(subscription.currentPeriodEnd!).toLocaleDateString('hr-HR')}`
                            }
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="small" icon={<ExternalLink size={14} />}
                            loading={actionLoading} onClick={openPortal}>
                            Control
                        </Button>
                        {!subscription.cancelAtPeriodEnd && (
                            <Button variant="danger" size="small" loading={actionLoading}
                                onClick={cancelSubscription}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {subscription?.status === 'pastdue' && (
                <StatusBanner color="danger" label="Payment failed. Update payment information in the portal." />
            )}

            {/* Plan card */}
            <div>
                <h2 className="font-semibold text-[var(--color-text)] mb-4">
                    {isPremium ? 'Change plan' : 'Choose Premium plan'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {PLANS.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrentPlan={plan.id === currentPriceId}
                            isPremium={isPremium}
                            onSelect={startCheckout}
                            loading={actionLoading}
                        />
                    ))}
                </div>
            </div>

            {/* Free plan comparison */}
            {!isPremium && (
                <div className="text-center text-sm text-[var(--color-text-muted)]">
                    You're staying on {' '}
                    <Link to="/dashboard" className="text-[var(--color-accent)] hover:underline">
                        free plan
                    </Link>
                    {' '} with 3 workout plans and basic logging.
                </div>
            )}
        </div>
    )
}
