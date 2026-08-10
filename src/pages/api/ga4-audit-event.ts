import type { APIRoute } from 'astro';

export const prerender = false;

const MEASUREMENT_ID = import.meta.env.GA4_MEASUREMENT_ID || 'G-1697T7D92W';
const ALLOWED_EVENTS = new Set([
	'ai_audit_cta_clicked',
	'begin_checkout',
	'ai_audit_checkout_started',
	'ai_audit_checkout_returned',
	'ai_audit_intake_started',
	'ai_audit_intake_halfway',
	'ai_audit_intake_completed',
	'purchase',
]);
const ALLOWED_PARAMS = new Set([
	'content_group',
	'tier',
	'value',
	'currency',
	'cta_location',
	'step_number',
	'checkout_session_present',
	'transaction_id',
	'debug_probe',
	'campaign',
	'ad_name',
	'placement',
	'landing_session_id',
	'items',
]);

function json(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}

function safeClientId(value: unknown): string | null {
	return typeof value === 'string' && /^[A-Za-z0-9._-]{1,100}$/.test(value) ? value : null;
}

function cleanParams(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
	const input = value as Record<string, unknown>;
	const output: Record<string, unknown> = {};
	for (const [key, param] of Object.entries(input)) {
		if (!ALLOWED_PARAMS.has(key)) continue;
		if (key === 'items') {
			if (Array.isArray(param)) output.items = param.slice(0, 10);
			continue;
		}
		if (typeof param === 'string' || typeof param === 'number' || typeof param === 'boolean') output[key] = param;
	}
	return output;
}

export const POST: APIRoute = async ({ request }) => {
	const apiSecret = import.meta.env.GA4_API_SECRET;
	if (!apiSecret) return json({ success: false, message: 'GA4 is not configured' }, 500);

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, message: 'Invalid JSON' }, 400);
	}

	const eventName = typeof body.event_name === 'string' ? body.event_name : '';
	const clientId = safeClientId(body.client_id);
	if (!ALLOWED_EVENTS.has(eventName) || !clientId) return json({ success: false, message: 'Invalid event' }, 400);

	const params = cleanParams(body.params);
	params.session_id = typeof body.session_id === 'string' && /^\d{10,13}$/.test(body.session_id) ? body.session_id : String(Math.floor(Date.now() / 1000));
	params.engagement_time_msec = 1;
	if (body.debug_mode === true) params.debug_mode = 1;
	if (body.debug_mode === true || body.internal_traffic === true) params.traffic_type = 'internal';

	const response = await fetch(
		`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(MEASUREMENT_ID)}&api_secret=${encodeURIComponent(apiSecret)}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ client_id: clientId, events: [{ name: eventName, params }] }),
		},
	);
	if (!response.ok) return json({ success: false, message: `GA4 rejected the event with ${response.status}` }, 502);
	return json({ success: true, event: eventName });
};
