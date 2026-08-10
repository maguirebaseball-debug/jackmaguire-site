export const AI_AUDIT_OFFER_ID = 'ai_bottleneck_snapshot';
export const AI_AUDIT_OFFER_NAME = 'One-Task AI Plan';
export const AI_AUDIT_TIER = 'snapshot';
export const AI_AUDIT_PRICE_ID = 'price_1U30DYFVkBlWBiJ6l8HQ0D5M';
export const AI_AUDIT_LEGACY_PRICE_ID = 'price_1U1m14FVkBlWBiJ6a9AhK0N3';
export const AI_AUDIT_PRODUCT_ID = 'prod_V1pgIey9mVVr3p';
export const AI_AUDIT_ALLOWED_AMOUNTS = [5900, 7900] as const;

type StripeMetadata = Record<string, string | undefined>;

type StripeLineItem = {
	price?: {
		id?: string;
		product?: string | { id?: string };
	};
};

type StripeCheckoutSession = {
	id?: string;
	livemode?: boolean;
	status?: string;
	payment_status?: string;
	amount_total?: number;
	currency?: string;
	client_reference_id?: string | null;
	payment_intent?: string | {
		id?: string;
		metadata?: StripeMetadata;
	};
	metadata?: StripeMetadata;
	line_items?: { data?: StripeLineItem[] };
};

export type VerifiedAuditOrder = {
	sessionId: string;
	paymentIntentId: string;
	amountTotal: number;
	currency: 'usd';
	clientReferenceId: string;
	metadata: Record<string, string>;
	paymentIntentMetadata: Record<string, string>;
};

export type AuditOrderVerification =
	| { status: 'verified'; order: VerifiedAuditOrder }
	| { status: 'pending_manual'; reason: 'stripe_key_missing' | 'stripe_unavailable' }
	| { status: 'rejected'; reason: 'invalid_session_id' | 'session_not_found' | 'payment_not_verified' | 'offer_not_verified' };

function cleanMetadata(value: StripeMetadata | undefined): Record<string, string> {
	if (!value) return {};
	return Object.fromEntries(
		Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
	);
}

function productId(value: StripeLineItem['price'] extends infer T ? T : never): string {
	if (!value || typeof value !== 'object') return '';
	if (typeof value.product === 'string') return value.product;
	return value.product?.id ?? '';
}

export function isAuditCheckoutSessionId(value: unknown): value is string {
	return typeof value === 'string' && /^cs_(?:live|test)_[A-Za-z0-9]{8,220}$/.test(value);
}

export function isAllowedAuditAmount(value: unknown): value is 5900 | 7900 {
	return typeof value === 'number' && AI_AUDIT_ALLOWED_AMOUNTS.includes(value as 5900 | 7900);
}

export async function verifyAuditOrder(
	sessionId: unknown,
	stripeKey = import.meta.env.STRIPE_AI_AUDIT_RESTRICTED_KEY,
): Promise<AuditOrderVerification> {
	if (!isAuditCheckoutSessionId(sessionId)) {
		return { status: 'rejected', reason: 'invalid_session_id' };
	}
	if (!stripeKey) return { status: 'pending_manual', reason: 'stripe_key_missing' };

	let response: Response;
	try {
		const url = new URL(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
		url.searchParams.append('expand[]', 'line_items');
		url.searchParams.append('expand[]', 'payment_intent');
		response = await fetch(url, {
			headers: { Authorization: `Bearer ${stripeKey}` },
		});
	} catch {
		return { status: 'pending_manual', reason: 'stripe_unavailable' };
	}

	if (response.status === 404) return { status: 'rejected', reason: 'session_not_found' };
	if (!response.ok) return { status: 'pending_manual', reason: 'stripe_unavailable' };

	const session = await response.json().catch(() => null) as StripeCheckoutSession | null;
	if (!session || session.id !== sessionId) return { status: 'rejected', reason: 'session_not_found' };
	if (
		session.livemode !== true ||
		session.status !== 'complete' ||
		session.payment_status !== 'paid' ||
		String(session.currency).toLowerCase() !== 'usd' ||
		!isAllowedAuditAmount(session.amount_total)
	) {
		return { status: 'rejected', reason: 'payment_not_verified' };
	}

	const metadata = cleanMetadata(session.metadata);
	const paymentIntent = typeof session.payment_intent === 'object' ? session.payment_intent : null;
	const paymentIntentId = typeof session.payment_intent === 'string'
		? session.payment_intent
		: paymentIntent?.id ?? '';
	const paymentIntentMetadata = cleanMetadata(paymentIntent?.metadata);
	const lineItems = session.line_items?.data ?? [];
	const expectedPrice = lineItems.some((item) =>
		item.price?.id === AI_AUDIT_PRICE_ID || item.price?.id === AI_AUDIT_LEGACY_PRICE_ID,
	);
	const expectedProduct = lineItems.some((item) => productId(item.price) === AI_AUDIT_PRODUCT_ID);
	const offerKey = metadata.offer_key || paymentIntentMetadata.offer_key || '';
	const tier = metadata.service_tier || paymentIntentMetadata.service_tier || '';
	const expectedMetadata = offerKey === AI_AUDIT_OFFER_ID && (!tier || tier === AI_AUDIT_TIER);

	if (!paymentIntentId || (!expectedPrice && !expectedProduct && !expectedMetadata)) {
		return { status: 'rejected', reason: 'offer_not_verified' };
	}

	return {
		status: 'verified',
		order: {
			sessionId,
			paymentIntentId,
			amountTotal: session.amount_total,
			currency: 'usd',
			clientReferenceId: typeof session.client_reference_id === 'string' ? session.client_reference_id : '',
			metadata,
			paymentIntentMetadata,
		},
	};
}
