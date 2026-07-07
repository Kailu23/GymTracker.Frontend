
export type PlanInterval = 'month' | 'year'

export interface SubscriptionPlan {
    id: string // Stripe price ID
    name: string
    interval: PlanInterval
    priceInEur: number
    features: string[]
}

export type SubscriptionStatus =
    | 'active'
    | 'cancelled'
    | 'past_due'
    | 'trialling'
    | 'free'

export interface UserSubscription {
    status: SubscriptionStatus
    planName: string | null
    interval: PlanInterval | null
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
    stripeCustomerId: string | null
}

export interface CreateCheckoutSessionRequest {
    priceId: string // Stripe price ID
    successUrl: string
    cancelUrl: string
}

export interface CreateCheckoutSessionResponse {
    checkoutUrl: string // Stripe hosted checkout URL
}

export interface CreatePortalSessionResponse {
    portalUrl: string // Stripe Customer Portal URL
}
