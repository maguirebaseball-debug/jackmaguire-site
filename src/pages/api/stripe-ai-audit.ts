import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

const PIXEL_ID = '1578848813945108';
const ALLOWED_EVENTS = new Set([
	'checkout.session.completed',
	'checkout.session.async_payment_succeeded',
]);

const PURCHASES = {
	snapshot: {
		amount: 7900,
		offerKey: 'ai_bottleneck_snapshot',
		name: 'AI Bottleneck Snapshot',
	},
	mini: {
		amount: 19900,
		offerKey: 'quick_win_mini_audit',
		name: 'Quick-Win Mini Audit',
	},
	full: {
		amount: 49900,
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

function decodeCheckoutAttribution(reference: unknown): { fbp?: string; fbc?: string } {
	if (typeof reference !== 'string' || !/^m1_[A-Za-z0-9_-]{1,197}$/.test(reference)) return {};

	try {
		const decoded = Buffer.from(reference.slice(3), 'base64url').toString('utf8');
		const [fbp, fbc] = decoded.split('|', 2);
		return {
			fbp: /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,100}$/.test(fbp) ? fbp : undefined,
			fbc: /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,150}$/.test(fbc) ? fbc : undefined,
		};
	} catch {
		return {};
	}
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

export const POST: APIRoute = async ({ request }) => {
	const rawPayload = await request.text();
	const webhookSecret = import.meta.env.STRIPE_AI_AUDIT_WEBHOOK_SECRET;
	const stripeSignature = request.headers.get('stripe-signature') ?? '';
	if (!webhookSecret) {
		return json({ success: false, message: 'Stripe webhook is not configured' }, 500);
	}
	if (!stripeSignature || !signatureMatches(rawPayload, stripeSignature, webhookSecret)) {
		return json({ success: false, message: 'Unauthorized' }, 401);
	}

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

	const session = event.data?.object;
	if (!session) return json({ success: false, message: 'Missing Checkout Session' }, 400);

	const serviceTier = String(session.metadata?.service_tier ?? '') as keyof typeof PURCHASES;
	const purchase = PURCHASES[serviceTier];
	const isExpectedPurchase = Boolean(
		purchase &&
		session.livemode === true &&
		session.payment_status === 'paid' &&
		session.amount_total === purchase.amount &&
		String(session.currency).toLowerCase() === 'usd' &&
		session.metadata?.offer_key === purchase.offerKey,
	);

	if (!isExpectedPurchase) {
		return json({ success: true, ignored: true });
	}

	const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
	if (!accessToken) {
		return json({ success: false, message: 'Meta CAPI is not configured' }, 500);
	}

	const email = String(session.customer_details?.email ?? session.customer_email ?? '').trim();
	const customerId = String(session.customer ?? '').trim();
	const attribution = decodeCheckoutAttribution(session.client_reference_id);
	const userData: Record<string, unknown> = {};
	if (email) userData.em = [sha256(email)];
	if (customerId) userData.external_id = [sha256(customerId)];
	if (attribution.fbp) userData.fbp = attribution.fbp;
	if (attribution.fbc) userData.fbc = attribution.fbc;

	const payload: Record<string, unknown> = {
		data: [
			{
				event_name: 'Purchase',
				event_id: `stripe_${session.id}`,
				event_time: event.created ?? Math.floor(Date.now() / 1000),
				action_source: 'website',
				event_source_url: 'https://jackmaguire.org/Your-AI-Audit/',
				user_data: userData,
				custom_data: {
					value: purchase.amount / 100,
					currency: 'USD',
					content_name: purchase.name,
					content_ids: [purchase.offerKey],
					content_type: 'product',
					num_items: 1,
					order_id: session.id,
					service_tier: serviceTier,
				},
			},
		],
	};

	const testEventCode = import.meta.env.META_CAPI_TEST_EVENT_CODE;
	if (testEventCode) payload.test_event_code = testEventCode;

	const metaResponse = await fetch(
		`https://graph.facebook.com/v25.0/${PIXEL_ID}/events?access_token=${accessToken}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		},
	);

	if (!metaResponse.ok) {
		return json({ success: false, message: 'Meta CAPI rejected the event' }, 502);
	}

	return json({ success: true, eventId: event.id ?? null, serviceTier });
};
