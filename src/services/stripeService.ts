import { api } from "./api";
import type {
    CreateCheckoutSessionRequest,
    CreateCheckoutSessionResponse,
    CreatePortalSessionResponse,
    UserSubscription
} from "@/types/subscriptionTypes";

export const stripeService = {
    getSubscription: () =>
        api.get<UserSubscription>('/subscriptions/me').then(r => r.data),

    createCheckoutSession: (data: CreateCheckoutSessionRequest) =>
        api.post<CreateCheckoutSessionResponse>('/subscriptions/checkout', data).then(r => r.data),

    createPortalSession: () =>
        api.post<CreatePortalSessionResponse>('/subscriptions/portal').then(r => r.data),

    cancelSubscription: () =>
        api.post<UserSubscription>('/subscriptions/cancel').then(r => r.data),
}
