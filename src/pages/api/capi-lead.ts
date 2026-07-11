import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

const PIXEL_ID = '1578848813945108';

function sha256(value: string): string {
	return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
	if (!accessToken) {
		return new Response(JSON.stringify({ success: false, message: 'CAPI not configured' }), { status: 500 });
	}

	let body: {
		email?: string;
		eventId?: string;
		eventName?: string;
		eventSourceUrl?: string;
		fbp?: string;
		fbc?: string;
	};
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), { status: 400 });
	}

	const userData: Record<string, unknown> = {
		client_ip_address: clientAddress,
		client_user_agent: request.headers.get('user-agent') ?? '',
	};
	if (body.email) {
		userData.em = [sha256(body.email)];
	}
	if (body.fbp) {
		userData.fbp = body.fbp;
	}
	if (body.fbc) {
		userData.fbc = body.fbc;
	}

	const payload = {
		data: [
			{
				event_name: body.eventName === 'lead_match' ? 'Purchase' : 'Lead',
				event_id: body.eventId,
				event_time: Math.floor(Date.now() / 1000),
				action_source: 'website',
				event_source_url: body.eventSourceUrl ?? 'https://jackmaguire.org/meet/',
				user_data: userData,
				custom_data: body.eventName === 'lead_match' 
					? { content_name: body.eventName, value: 10.00, currency: 'USD' } 
					: (body.eventName ? { content_name: body.eventName } : undefined),
			},
		],
	};

	const metaResponse = await fetch(
		`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${accessToken}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		},
	);

	if (!metaResponse.ok) {
		const errText = await metaResponse.text();
		return new Response(JSON.stringify({ success: false, message: errText }), { status: 502 });
	}

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
