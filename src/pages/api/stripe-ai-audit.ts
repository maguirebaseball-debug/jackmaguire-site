import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import {
	AI_AUDIT_ALLOWED_AMOUNTS,
	AI_AUDIT_OFFER_ID,
	AI_AUDIT_OFFER_NAME,
	AI_AUDIT_TIER,
	isAuditCheckoutSessionId,
	verifyAuditOrder,
} from '../../lib/ai-audit-order';

export const prerender = false;

const PIXEL_ID = '1578848813945108';
const ALLOWED_EVENTS = new Set([
	'checkout.session.completed',
	'checkout.session.async_payment_succeeded',
	'refund.created',
	'refund.updated',
	'refund.failed',
]);

const PURCHASES = {
	snapshot: {
		amounts: AI_AUDIT_ALLOWED_AMOUNTS,
		offerKey: AI_AUDIT_OFFER_ID,
		name: AI_AUDIT_OFFER_NAME,
	},
	mini: {
		amounts: [19900],
		offerKey: 'quick_win_mini_audit',
		name: 'Quick-Win Mini Audit',
	},
	full: {
		amounts: [49900],
		offerKey: 'full_ai_audit',
		name: 'Full AI Audit',
	},
} as const;

function sha256(value: string): string {
	return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function signatureMatches(payload: string, signatureHeader: string, secret: string): boolean {
	const parts = signatureHeader.split(',').map((part) => part.trim().split('='));
	const timestamp = parts.find(([key]) => key === 't')?.[1];
	const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
	if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp)) return false;

	const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
	if (ageSeconds > 300) return false;

	const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest();
	return signatures.some((signature) => {
		if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
		const actual = Buffer.from(signature, 'hex');
		return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
	});
}

function decodeCheckoutAttribution(reference: unknown): { fbp?: string; fbc?: string; gaClientId?: string } {
	if (typeof reference !== 'string' || !/^m1_[A-Za-z0-9_-]{1,197}$/.test(reference)) return {};

	try {
		const decoded = Buffer.from(reference.slice(3), 'base64url').toString('utf8');
		const [fbp, fbc, gaClientId] = decoded.split('|', 3);
		return {
			fbp: /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,100}$/.test(fbp) ? fbp : undefined,
			fbc: /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,150}$/.test(fbc) ? fbc : undefined,
			gaClientId: /^(?:\d+\.\d+|audit\.[A-Za-z0-9._-]{8,90})$/.test(gaClientId) ? gaClientId : undefined,
		};
	} catch {
		return {};
	}
}

function cleanMetadataValue(value: unknown, pattern: RegExp): string | undefined {
	return typeof value === 'string' && pattern.test(value) ? value : undefined;
}

function readSessionAttribution(session: Record<string, any>): {
	fbp?: string;
	fbc?: string;
	gaClientId?: string;
	campaign?: string;
	adName?: string;
	placement?: string;
	landingSessionId?: string;
	campaignId?: string;
	adsetId?: string;
	adId?: string;
	siteSourceName?: string;
	gaSessionId?: string;
} {
	const fallback = decodeCheckoutAttribution(session.client_reference_id);
	const metadata = session.metadata ?? {};
	return {
		fbp: cleanMetadataValue(metadata.meta_fbp, /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,100}$/) ?? fallback.fbp,
		fbc: cleanMetadataValue(metadata.meta_fbc, /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,150}$/) ?? fallback.fbc,
		gaClientId: cleanMetadataValue(metadata.ga_client_id, /^(?:\d+\.\d+|audit\.[A-Za-z0-9._-]{8,90})$/) ?? fallback.gaClientId,
		campaign: cleanMetadataValue(metadata.campaign, /^[^\u0000-\u001f]{1,200}$/),
		adName: cleanMetadataValue(metadata.ad_name, /^[^\u0000-\u001f]{1,200}$/),
		placement: cleanMetadataValue(metadata.placement, /^[^\u0000-\u001f]{1,200}$/),
		landingSessionId: cleanMetadataValue(metadata.landing_session_id, /^[A-Za-z0-9._-]{1,100}$/),
		campaignId: cleanMetadataValue(metadata.campaign_id, /^[A-Za-z0-9._:-]{1,100}$/),
		adsetId: cleanMetadataValue(metadata.adset_id, /^[A-Za-z0-9._:-]{1,100}$/),
		adId: cleanMetadataValue(metadata.ad_id, /^[A-Za-z0-9._:-]{1,100}$/),
		siteSourceName: cleanMetadataValue(metadata.site_source_name, /^[A-Za-z0-9._:-]{1,50}$/),
		gaSessionId: cleanMetadataValue(metadata.ga_session_id, /^\d{10,13}$/),
	};
}

function json(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
		},
	});
}

type ResolvedRefund = {
	transactionId: string;
	amount: number;
	gaClientId: string;
	gaSessionId?: string;
};

async function resolveRefund(
	refund: Record<string, any>,
	stripeKey: string | undefined,
): Promise<ResolvedRefund | null> {
	const amount = Number(refund.amount);
	const metadata = refund.metadata ?? {};
	const directSessionId = metadata.checkout_session_id;
	const directMappingIsReliable =
		isAuditCheckoutSessionId(directSessionId) &&
		metadata.offer_key === AI_AUDIT_OFFER_ID &&
		metadata.service_tier === AI_AUDIT_TIER &&
		AI_AUDIT_ALLOWED_AMOUNTS.includes(amount as 5900 | 7900);
	if (directMappingIsReliable) {
		return {
			transactionId: directSessionId,
			amount,
			gaClientId: cleanMetadataValue(metadata.ga_client_id, /^(?:\d+\.\d+|audit\.[A-Za-z0-9._-]{8,90})$/) || `stripe.${directSessionId}`,
			gaSessionId: cleanMetadataValue(metadata.ga_session_id, /^\d{10,13}$/),
		};
	}

	const paymentIntentId = typeof refund.payment_intent === 'string' ? refund.payment_intent : '';
	if (!stripeKey || !/^pi_[A-Za-z0-9_]{8,220}$/.test(paymentIntentId)) return null;

	let response: Response;
	try {
		const url = new URL('https://api.stripe.com/v1/checkout/sessions');
		url.searchParams.set('payment_intent', paymentIntentId);
		url.searchParams.set('limit', '1');
		response = await fetch(url, { headers: { Authorization: `Bearer ${stripeKey}` } });
	} catch {
		return null;
	}
	if (!response.ok) return null;
	const result = await response.json().catch(() => ({})) as { data?: Array<{ id?: string }> };
	const sessionId = result.data?.[0]?.id;
	if (!sessionId) return null;
	const verification = await verifyAuditOrder(sessionId, stripeKey);
	if (verification.status !== 'verified' || amount !== verification.order.amountTotal) return null;
	const combinedMetadata = { ...verification.order.paymentIntentMetadata, ...verification.order.metadata };
	return {
		transactionId: verification.order.sessionId,
		amount,
		gaClientId: cleanMetadataValue(combinedMetadata.ga_client_id, /^(?:\d+\.\d+|audit\.[A-Za-z0-9._-]{8,90})$/) || `stripe.${verification.order.sessionId}`,
		gaSessionId: cleanMetadataValue(combinedMetadata.ga_session_id, /^\d{10,13}$/),
	};
}

async function sendGaRefund(refund: ResolvedRefund, isTestEvent: boolean): Promise<{ sent?: boolean; skipped?: boolean; reason?: string }> {
	const gaApiSecret = import.meta.env.GA4_API_SECRET;
	if (!gaApiSecret) return { skipped: true, reason: 'GA4_API_SECRET missing' };
	const gaMeasurementId = import.meta.env.GA4_MEASUREMENT_ID || 'G-1697T7D92W';
	const response = await fetch(
		`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(gaMeasurementId)}&api_secret=${encodeURIComponent(gaApiSecret)}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				client_id: refund.gaClientId,
				events: [{
					name: 'refund',
					params: {
						currency: 'USD',
						value: refund.amount / 100,
						transaction_id: refund.transactionId,
						...(refund.gaSessionId ? { session_id: refund.gaSessionId } : {}),
						items: [{
							item_id: AI_AUDIT_OFFER_ID,
							item_name: AI_AUDIT_OFFER_NAME,
							price: refund.amount / 100,
							quantity: 1,
						}],
						...(isTestEvent ? { debug_mode: 1, test_mode: true, traffic_type: 'internal' } : {}),
					},
				}],
			}),
		},
	);
	if (!response.ok) throw new Error(`GA4 refund rejected with ${response.status}`);
	return { sent: true };
}

export const POST: APIRoute = async ({ request }) => {
	const rawPayload = await request.text();
	const liveWebhookSecret = import.meta.env.STRIPE_AI_AUDIT_WEBHOOK_SECRET;
	const testWebhookSecret = import.meta.env.STRIPE_AI_AUDIT_TEST_WEBHOOK_SECRET;
	const stripeSignature = request.headers.get('stripe-signature') ?? '';
	const webhookSecrets = [liveWebhookSecret, testWebhookSecret].filter(
		(secret): secret is string => Boolean(secret),
	);
	if (webhookSecrets.length === 0) {
		return json({ success: false, message: 'Stripe webhook is not configured' }, 500);
	}
	const verifiedSecret = webhookSecrets.find((secret) =>
		stripeSignature && signatureMatches(rawPayload, stripeSignature, secret),
	);
	if (!verifiedSecret) {
		return json({ success: false, message: 'Unauthorized' }, 401);
	}
	const isTestEvent = Boolean(testWebhookSecret && verifiedSecret === testWebhookSecret);

	let event: {
		id?: string;
		created?: number;
		type?: string;
		data?: { object?: Record<string, any> };
	};

	try {
		event = JSON.parse(rawPayload);
	} catch {
		return json({ success: false, message: 'Invalid event body' }, 400);
	}

	if (!event.type || !ALLOWED_EVENTS.has(event.type)) {
		return json({ success: true, ignored: true });
	}

	const eventObject = event.data?.object;
	if (!eventObject) return json({ success: false, message: 'Missing Stripe event object' }, 400);

	if (event.type.startsWith('refund.')) {
		const refund = eventObject;
		if (refund.livemode !== !isTestEvent || String(refund.currency).toLowerCase() !== 'usd') {
			return json({ success: true, ignored: true });
		}
		if (event.type === 'refund.failed' || refund.status === 'failed') {
			console.error('[stripe-ai-audit] Stripe refund failed', refund.id ?? 'unknown', refund.failure_reason ?? 'unknown');
			return json({ success: true, refund_status: 'failed', refund_id: refund.id ?? null });
		}
		if (refund.status !== 'succeeded') {
			return json({ success: true, refund_status: String(refund.status || 'pending'), refund_id: refund.id ?? null });
		}

		const resolved = await resolveRefund(refund, import.meta.env.STRIPE_AI_AUDIT_RESTRICTED_KEY);
		if (!resolved) {
			console.error('[stripe-ai-audit] Succeeded refund could not be mapped reliably', refund.id ?? 'unknown');
			return json({ success: true, ignored: true, reason: 'refund_unmapped', refund_id: refund.id ?? null });
		}

		try {
			const ga4 = await sendGaRefund(resolved, isTestEvent);
			return json({ success: true, refund_status: 'succeeded', refund_id: refund.id ?? null, transaction_id: resolved.transactionId, ga4 });
		} catch (error) {
			console.error('[stripe-ai-audit] GA4 refund delivery failed', error);
			return json({ success: false, message: 'GA4 refund delivery failed' }, 502);
		}
	}

	const session = eventObject;
	if (!session) return json({ success: false, message: 'Missing Checkout Session' }, 400);

	const metadataTier = String(session.metadata?.service_tier ?? '') as keyof typeof PURCHASES;
	const serviceTier = (metadataTier || (isTestEvent && PURCHASES.snapshot.amounts.includes(session.amount_total) ? 'snapshot' : '')) as keyof typeof PURCHASES;
	const purchase = PURCHASES[serviceTier];
	const isExpectedPurchase = Boolean(
		purchase &&
		session.livemode === !isTestEvent &&
		session.payment_status === 'paid' &&
		purchase.amounts.includes(session.amount_total) &&
		String(session.currency).toLowerCase() === 'usd' &&
		(isTestEvent || session.metadata?.offer_key === purchase.offerKey),
	);

	if (!isExpectedPurchase) {
		return json({ success: true, ignored: true });
	}

	const email = String(session.customer_details?.email ?? session.customer_email ?? '').trim();
	const customerId = String(session.customer ?? '').trim();
	const attribution = readSessionAttribution(session);
	const userData: Record<string, unknown> = {};
	if (email) userData.em = [sha256(email)];
	if (customerId) userData.external_id = [sha256(customerId)];
	if (attribution.fbp) userData.fbp = attribution.fbp;
	if (attribution.fbc) userData.fbc = attribution.fbc;

	const metaPayload: Record<string, unknown> = {
		data: [
			{
				event_name: 'Purchase',
				event_id: `stripe_${session.id}`,
				event_time: event.created ?? Math.floor(Date.now() / 1000),
				action_source: 'website',
				event_source_url: 'https://jackmaguire.org/Your-AI-Audit/',
				user_data: userData,
				custom_data: {
					value: session.amount_total / 100,
					currency: 'USD',
					content_name: purchase.name,
					content_ids: [purchase.offerKey],
					content_type: 'product',
					num_items: 1,
					order_id: session.id,
					service_tier: serviceTier,
					...(attribution.campaign ? { campaign: attribution.campaign } : {}),
					...(attribution.adName ? { ad_name: attribution.adName } : {}),
					...(attribution.placement ? { placement: attribution.placement } : {}),
					...(attribution.landingSessionId ? { landing_session_id: attribution.landingSessionId } : {}),
					...(attribution.campaignId ? { campaign_id: attribution.campaignId } : {}),
					...(attribution.adsetId ? { adset_id: attribution.adsetId } : {}),
					...(attribution.adId ? { ad_id: attribution.adId } : {}),
					...(attribution.siteSourceName ? { site_source_name: attribution.siteSourceName } : {}),
				},
			},
		],
	};

	const testEventCode = isTestEvent ? import.meta.env.META_CAPI_TEST_EVENT_CODE : undefined;
	if (testEventCode) metaPayload.test_event_code = testEventCode;

	const gaMeasurementId = import.meta.env.GA4_MEASUREMENT_ID || 'G-1697T7D92W';
	const gaApiSecret = import.meta.env.GA4_API_SECRET;
	const gaClientId = attribution.gaClientId || `stripe.${session.id}`;

	const [metaResult, gaResult] = await Promise.allSettled([
		(async () => {
			const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
			if (!accessToken) return { skipped: true, reason: 'META_CAPI_ACCESS_TOKEN missing' };
			const response = await fetch(
				`https://graph.facebook.com/v25.0/${PIXEL_ID}/events?access_token=${accessToken}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(metaPayload),
				},
			);
			if (!response.ok) throw new Error(`Meta CAPI rejected the event with ${response.status}`);
			return { sent: true };
		})(),
		(async () => {
			if (!gaApiSecret) return { skipped: true, reason: 'GA4_API_SECRET missing' };
			const response = await fetch(
				`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(gaMeasurementId)}&api_secret=${encodeURIComponent(gaApiSecret)}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						client_id: gaClientId,
						events: [
							{
								name: 'purchase',
								params: {
									currency: 'USD',
									value: session.amount_total / 100,
									transaction_id: session.id,
									service_tier: serviceTier,
									...(attribution.gaSessionId ? { session_id: attribution.gaSessionId } : {}),
									items: [{
										item_id: purchase.offerKey,
										item_name: purchase.name,
										price: session.amount_total / 100,
										quantity: 1,
									}],
									...(attribution.campaign ? { campaign: attribution.campaign } : {}),
									...(attribution.campaignId ? { campaign_id: attribution.campaignId } : {}),
									...(attribution.adName ? { ad_name: attribution.adName } : {}),
									...(attribution.adsetId ? { adset_id: attribution.adsetId } : {}),
									...(attribution.adId ? { ad_id: attribution.adId } : {}),
									...(attribution.placement ? { placement: attribution.placement } : {}),
									...(attribution.siteSourceName ? { site_source_name: attribution.siteSourceName } : {}),
									...(attribution.landingSessionId ? { landing_session_id: attribution.landingSessionId } : {}),
									...(isTestEvent ? { debug_mode: 1, test_mode: true, traffic_type: 'internal' } : {}),
								},
							},
						],
					}),
				},
			);
			if (!response.ok) throw new Error(`GA4 Measurement Protocol rejected the event with ${response.status}`);
			return { sent: true };
		})(),
	]);

	if (metaResult.status === 'rejected') console.error('[stripe-ai-audit] Meta CAPI delivery failed', metaResult.reason);
	if (gaResult.status === 'rejected') console.error('[stripe-ai-audit] GA4 purchase delivery failed', gaResult.reason);
	if (metaResult.status === 'rejected' || gaResult.status === 'rejected') {
		return json({ success: false, message: 'One or more conversion destinations rejected the event' }, 502);
	}

	return json({ success: true, eventId: event.id ?? null, serviceTier, meta: metaResult.value, ga4: gaResult.value });
};
