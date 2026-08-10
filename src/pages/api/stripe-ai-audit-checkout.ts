import type { APIRoute } from 'astro';

export const prerender = false;

const SNAPSHOT_PRICE_ID = import.meta.env.STRIPE_AI_SNAPSHOT_PRICE_ID || 'price_1U1m14FVkBlWBiJ6a9AhK0N3';
const SNAPSHOT_FALLBACK_URL = import.meta.env.PUBLIC_AI_SNAPSHOT_CHECKOUT_URL || 'https://buy.stripe.com/14A4gz5SV91NcVp95s53O00';
const SITE_ORIGIN = 'https://jackmaguire.org';

type CheckoutAttribution = {
	utm_source?: string;
	utm_medium?: string;
	campaign?: string;
	ad_name?: string;
	placement?: string;
	landing_session_id?: string;
	meta_fbclid?: string;
	meta_fbp?: string;
	meta_fbc?: string;
	ga_client_id?: string;
	client_reference_id?: string;
};

function json(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}

function cleanText(value: unknown, maxLength: number): string {
	if (typeof value !== 'string') return '';
	const cleaned = value.trim();
	if (!cleaned || cleaned.length > maxLength || /[\u0000-\u001F\u007F]/.test(cleaned)) return '';
	return cleaned;
}

function cleanId(value: unknown, maxLength = 150): string {
	const cleaned = cleanText(value, maxLength);
	return /^[A-Za-z0-9._:-]+$/.test(cleaned) ? cleaned : '';
}

function cleanFbp(value: unknown): string {
	const cleaned = cleanText(value, 150);
	return /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,100}$/.test(cleaned) ? cleaned : '';
}

function cleanFbc(value: unknown): string {
	const cleaned = cleanText(value, 220);
	return /^fb\.1\.\d{10,14}\.[A-Za-z0-9._-]{1,170}$/.test(cleaned) ? cleaned : '';
}

function cleanGaClientId(value: unknown): string {
	const cleaned = cleanText(value, 100);
	return /^\d+\.\d+$/.test(cleaned) ? cleaned : '';
}

function cleanClientReference(value: unknown): string {
	const cleaned = cleanText(value, 200);
	return /^m1_[A-Za-z0-9_-]{1,197}$/.test(cleaned) ? cleaned : '';
}

function setMetadata(params: URLSearchParams, metadata: Record<string, string>): void {
	for (const [key, value] of Object.entries(metadata)) {
		if (!value) continue;
		params.set(`metadata[${key}]`, value);
		params.set(`payment_intent_data[metadata][${key}]`, value);
	}
}

function addAttributionToUrl(url: URL, attribution: Record<string, string>): void {
	const values = {
		utm_source: attribution.utm_source,
		utm_medium: attribution.utm_medium,
		utm_campaign: attribution.campaign,
		utm_content: attribution.ad_name,
		utm_term: attribution.placement,
	};
	for (const [key, value] of Object.entries(values)) {
		if (value) url.searchParams.set(key, value);
	}
}

export const POST: APIRoute = async ({ request }) => {
	const requestUrl = new URL(request.url);
	const requestOrigin = request.headers.get('origin');
	if (requestOrigin) {
		try {
			const originUrl = new URL(requestOrigin);
			if (originUrl.hostname !== requestUrl.hostname && originUrl.origin !== SITE_ORIGIN) {
				return json({ success: false, message: 'Origin not allowed' }, 403);
			}
		} catch {
			return json({ success: false, message: 'Invalid origin' }, 403);
		}
	}

	const stripeKey = import.meta.env.STRIPE_AI_AUDIT_RESTRICTED_KEY;
	if (!stripeKey) {
		return json({ success: false, message: 'Dynamic checkout is not configured', fallback_url: SNAPSHOT_FALLBACK_URL }, 503);
	}

	let input: CheckoutAttribution & { tier?: string };
	try {
		input = await request.json();
	} catch {
		return json({ success: false, message: 'Invalid JSON' }, 400);
	}
	if (input.tier !== 'snapshot') return json({ success: false, message: 'Invalid offer' }, 400);

	const attribution = {
		utm_source: cleanText(input.utm_source, 100),
		utm_medium: cleanText(input.utm_medium, 100),
		campaign: cleanText(input.campaign, 150),
		ad_name: cleanText(input.ad_name, 150),
		placement: cleanText(input.placement, 100),
		landing_session_id: cleanId(input.landing_session_id, 150),
		meta_fbclid: cleanText(input.meta_fbclid, 500),
		meta_fbp: cleanFbp(input.meta_fbp),
		meta_fbc: cleanFbc(input.meta_fbc),
		ga_client_id: cleanGaClientId(input.ga_client_id),
	};
	const clientReferenceId = cleanClientReference(input.client_reference_id);

	const successUrl = new URL('/Your-AI-Audit/start/', SITE_ORIGIN);
	successUrl.searchParams.set('tier', 'snapshot');
	successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
	addAttributionToUrl(successUrl, attribution);
	const cancelUrl = new URL('/Your-AI-Audit/', SITE_ORIGIN);
	cancelUrl.searchParams.set('checkout', 'cancelled');
	addAttributionToUrl(cancelUrl, attribution);

	const stripeParams = new URLSearchParams();
	stripeParams.set('mode', 'payment');
	stripeParams.set('line_items[0][price]', SNAPSHOT_PRICE_ID);
	stripeParams.set('line_items[0][quantity]', '1');
	stripeParams.set('success_url', successUrl.toString());
	stripeParams.set('cancel_url', cancelUrl.toString());
	stripeParams.set('customer_creation', 'always');
	stripeParams.set('billing_address_collection', 'auto');
	stripeParams.set('submit_type', 'pay');
	stripeParams.set('custom_text[submit][message]', 'After payment, complete the eight-question intake. Your one-business-day delivery window begins when the intake is submitted.');
	if (clientReferenceId) stripeParams.set('client_reference_id', clientReferenceId);

	setMetadata(stripeParams, {
		offer_key: 'ai_bottleneck_snapshot',
		service_tier: 'snapshot',
		source_site: 'jackmaguire.org',
		utm_source: attribution.utm_source,
		utm_medium: attribution.utm_medium,
		campaign: attribution.campaign,
		ad_name: attribution.ad_name,
		placement: attribution.placement,
		landing_session_id: attribution.landing_session_id,
		meta_fbclid: attribution.meta_fbclid,
		meta_fbp: attribution.meta_fbp,
		meta_fbc: attribution.meta_fbc,
		ga_client_id: attribution.ga_client_id,
	});

	const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${stripeKey}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: stripeParams.toString(),
	});
	const stripeResult = await stripeResponse.json().catch(() => ({})) as { id?: string; url?: string; error?: { message?: string } };
	if (!stripeResponse.ok || !stripeResult.id || !stripeResult.url) {
		console.error('[stripe-ai-audit-checkout] Stripe rejected Checkout Session creation', stripeResponse.status, stripeResult.error?.message || 'Unknown error');
		return json({ success: false, message: 'Secure checkout is temporarily unavailable', fallback_url: SNAPSHOT_FALLBACK_URL }, 502);
	}

	return json({ success: true, session_id: stripeResult.id, url: stripeResult.url });
};
