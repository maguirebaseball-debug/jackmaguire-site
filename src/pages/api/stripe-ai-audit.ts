import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

const PIXEL_ID = '1578848813945108';
const WEBHOOK_TOKEN_SHA256 = '69c7849458ffde791d70d26994468a0c693076200801efd892ab5d7047aa3494';
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

function tokenMatches(token: string): boolean {
	const actual = Buffer.from(sha256(token), 'hex');
	const expected = Buffer.from(WEBHOOK_TOKEN_SHA256, 'hex');
	return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
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

export const POST: APIRoute = async ({ request, url }) => {
	const webhookToken = url.searchParams.get('token') ?? '';
	if (!webhookToken || !tokenMatches(webhookToken)) {
		return json({ success: false, message: 'Unauthorized' }, 401);
	}

	let event: {
		id?: string;
		created?: number;
		type?: string;
		data?: { object?: Record<string, any> };
	};

	try {
		event = await request.json();
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
	const userData: Record<string, unknown> = {};
	if (email) userData.em = [sha256(email)];
	if (customerId) userData.external_id = [sha256(customerId)];

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
