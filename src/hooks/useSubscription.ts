import { useState, useEffect, useCallback } from "react";
import { stripeService } from "@/services/stripeService";
import { useAuthStore } from "@/store/authStore";
import type { UserSubscription, CreateCheckoutSessionRequest } from "@/types/subscriptionTypes";

export function useSubscription() {
    const [subscription, setSubscription] = useState<UserSubscription | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    const setUser = useAuthStore(s => s.setUser)
    const user = useAuthStore(s => s.user)

    useEffect(() => {
        stripeService.getSubscription()
            .then(setSubscription)
            .catch(() => setError('Not possible to load data about subscription.'))
            .finally(() => setIsLoading(false))
    }, [])

    const startCheckout = useCallback(async (priceId: string) => {
        setActionLoading(true)
        try {
            const { checkoutUrl } = await stripeService.createCheckoutSession({
                priceId,
                successUrl: `${window.location.origin}/subscription?success=true`,
                cancelUrl: `${window.location.origin}/subscription?canceled=true`
            } satisfies CreateCheckoutSessionRequest)

            // Redirect
            window.location.href = checkoutUrl
        } finally {
            setActionLoading(false)
        }
    }, [])

    const openPortal = useCallback(async () => {
        setActionLoading(true)
        try {
            const { portalUrl } = await stripeService.createPortalSession()
            window.location.href = portalUrl
        } finally {
            setActionLoading(false)
        }
    }, [])

    const cancelSubscription = useCallback(async () => {
        setActionLoading(true)
        try {
            const updated = await stripeService.cancelSubscription()
            setSubscription(updated)

            if (user) {
                setUser({ ...user, subscriptionStatus: updated.status === 'active' ? 'premium' : 'free' })
            }
        } finally {
            setActionLoading(false)
        }
    }, [user, setUser])

    const isPremium = subscription?.status === 'active' || subscription?.status === 'trialling'

    return {
        subscription,
        isLoading,
        error,
        actionLoading,
        isPremium,
        startCheckout,
        openPortal,
        cancelSubscription,
    }
}
