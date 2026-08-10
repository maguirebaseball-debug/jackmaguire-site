import type { APIRoute } from 'astro';
import {
	AI_AUDIT_OFFER_ID,
	AI_AUDIT_OFFER_NAME,
	AI_AUDIT_TIER,
	type AuditOrderVerification,
	verifyAuditOrder,
} from '../../lib/ai-audit-order';

export const prerender = false;

const SITE_ORIGIN = 'https://jackmaguire.org';
const EXISTING_WEB3FORMS_ACCESS_KEY = '0d5ededb-778b-452f-b8f0-72ebb2e4e461';

const WORKFLOW_OPTIONS = new Set([
	'Inbox sorting and replies',
	'Meeting notes and action items',
	'Spreadsheet updates or reporting',
	'Scheduling and reminders',
	'Recurring research or summaries',
	'Drafting routine messages or documents',
	'Personal or household admin',
	'Expense or receipt sorting',
	'Data entry or moving information between tools',
	'Something else',
]);
const OUTCOME_OPTIONS = new Set([
	'Spend less time doing it',
	'Respond faster',
	'Miss fewer follow-ups or deadlines',
	'Reduce manual copying or data entry',
	'Make the output more consistent',
	'Make it easier to delegate',
	'Get a clearer report or summary',
	'Something else',
]);
const CONSTRAINT_OPTIONS = new Set([
	'I do not want to change my current core software',
	'The task involves sensitive personal or client information',
	'I need a no-code setup',
	'I want to keep new software under $25 per month',
	'I want to keep new software under $60 per month',
	'Someone else must be able to maintain it',
	'I have no major constraints',
	'Something else',
]);

type IntakePayload = {
	q1_weekly_context: string;
	q2_workflow: string;
	q2_workflow_other: string;
	q3_current_process: string;
	q4_weekly_frequency: number;
	q5_minutes_per_occurrence: number;
	q6_current_tools: string;
	q7_outcomes: string[];
	q7_outcome_other: string;
	q8_constraints: string[];
	q8_constraint_notes: string;
	projection_acknowledgement: 'Agreed';
};

type IntakeAttribution = {
	utm_source: string;
	utm_medium: string;
	utm_campaign: string;
	utm_content: string;
	utm_term: string;
	campaign_id: string;
	adset_id: string;
	ad_id: string;
	placement: string;
	site_source_name: string;
	landing_session_id: string;
	first_landing_at: string;
	ga_client_id: string;
	ga_session_id: string;
};

function json(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}

function originAllowed(request: Request): boolean {
	const requestOrigin = new URL(request.url).origin;
	const origin = request.headers.get('origin');
	if (!origin) return true;
	try {
		const parsed = new URL(origin);
		return parsed.origin === requestOrigin || parsed.origin === SITE_ORIGIN;
	} catch {
		return false;
	}
}

function cleanText(value: unknown, minLength: number, maxLength: number, optional = false): string | null {
	if (typeof value !== 'string') return optional ? '' : null;
	const cleaned = value.trim();
	if (optional && !cleaned) return '';
	if (cleaned.length < minLength || cleaned.length > maxLength) return null;
	if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(cleaned)) return null;
	return cleaned;
}

function cleanInteger(value: unknown, min: number, max: number): number | null {
	const parsed = typeof value === 'number' ? value : Number(value);
	return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function cleanSelections(value: unknown, allowed: Set<string>): string[] | null {
	const values = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
	const cleaned = [...new Set(values.filter((item): item is string => typeof item === 'string').map((item) => item.trim()))];
	if (cleaned.length === 0 || cleaned.length > allowed.size || cleaned.some((item) => !allowed.has(item))) return null;
	return cleaned;
}

function cleanIdentifier(value: unknown, maxLength: number): string {
	const cleaned = cleanText(value, 1, maxLength, true);
	return cleaned && /^[A-Za-z0-9._:-]+$/.test(cleaned) ? cleaned : '';
}

function cleanAttribution(value: unknown): IntakeAttribution {
	const input = value && typeof value === 'object' && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
	const firstLanding = cleanText(input.first_landing_at, 1, 40, true) || '';
	return {
		utm_source: cleanText(input.utm_source, 1, 100, true) || '',
		utm_medium: cleanText(input.utm_medium, 1, 100, true) || '',
		utm_campaign: cleanText(input.utm_campaign ?? input.campaign, 1, 150, true) || '',
		utm_content: cleanText(input.utm_content ?? input.ad_name, 1, 150, true) || '',
		utm_term: cleanText(input.utm_term ?? input.placement, 1, 100, true) || '',
		campaign_id: cleanIdentifier(input.campaign_id ?? input.utm_id, 100),
		adset_id: cleanIdentifier(input.adset_id, 100),
		ad_id: cleanIdentifier(input.ad_id, 100),
		placement: cleanText(input.placement ?? input.utm_term, 1, 100, true) || '',
		site_source_name: cleanIdentifier(input.site_source_name, 50),
		landing_session_id: cleanIdentifier(input.landing_session_id, 150),
		first_landing_at: firstLanding && Number.isFinite(Date.parse(firstLanding))
			? new Date(firstLanding).toISOString()
			: '',
		ga_client_id: cleanText(input.ga_client_id, 1, 100, true) && /^(?:\d+\.\d+|audit\.[A-Za-z0-9._-]{8,90})$/.test(String(input.ga_client_id).trim())
			? String(input.ga_client_id).trim()
			: '',
		ga_session_id: /^\d{10,13}$/.test(String(input.ga_session_id || '').trim())
			? String(input.ga_session_id).trim()
			: '',
	};
}

function cleanIntake(value: unknown): IntakePayload | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	const input = value as Record<string, unknown>;
	const q1 = cleanText(input.q1_weekly_context, 5, 2000);
	const q2 = cleanText(input.q2_workflow, 1, 100);
	const q2Other = cleanText(input.q2_workflow_other, 1, 300, true);
	const q3 = cleanText(input.q3_current_process, 5, 4000);
	const q4 = cleanInteger(input.q4_weekly_frequency, 1, 500);
	const q5 = cleanInteger(input.q5_minutes_per_occurrence, 1, 480);
	const q6 = cleanText(input.q6_current_tools, 1, 2000);
	const q7 = cleanSelections(input.q7_outcomes, OUTCOME_OPTIONS);
	const q7Other = cleanText(input.q7_outcome_other, 1, 300, true);
	const q8 = cleanSelections(input.q8_constraints, CONSTRAINT_OPTIONS);
	const q8Notes = cleanText(input.q8_constraint_notes, 1, 1000, true);
	const acknowledged = input.projection_acknowledgement === true || input.projection_acknowledgement === 'Agreed';

	if (
		q1 === null || q2 === null || !WORKFLOW_OPTIONS.has(q2) ||
		q2Other === null || (q2 === 'Something else' && !q2Other) ||
		q3 === null || q4 === null || q5 === null || q6 === null ||
		q7 === null || q7Other === null || (q7.includes('Something else') && !q7Other) ||
		q8 === null || q8Notes === null || !acknowledged
	) return null;

	return {
		q1_weekly_context: q1,
		q2_workflow: q2,
		q2_workflow_other: q2Other,
		q3_current_process: q3,
		q4_weekly_frequency: q4,
		q5_minutes_per_occurrence: q5,
		q6_current_tools: q6,
		q7_outcomes: q7,
		q7_outcome_other: q7Other,
		q8_constraints: q8,
		q8_constraint_notes: q8Notes,
		projection_acknowledgement: 'Agreed',
	};
}

function verificationResponse(verification: AuditOrderVerification): Record<string, unknown> {
	if (verification.status === 'verified') {
		return {
			success: true,
			state: 'verified',
			status: 'verified',
			transaction_id: verification.order.sessionId,
			amount: verification.order.amountTotal / 100,
			currency: verification.order.currency.toUpperCase(),
		};
	}
	return {
		success: verification.status === 'pending_manual',
		state: verification.status,
		status: verification.status,
		reason: verification.reason,
	};
}

async function relayToWeb3Forms(
	sessionId: string,
	intake: IntakePayload,
	verificationState: 'verified' | 'pending_manual',
	attribution: IntakeAttribution,
): Promise<boolean> {
	const accessKey = import.meta.env.WEB3FORMS_AI_AUDIT_ACCESS_KEY || EXISTING_WEB3FORMS_ACCESS_KEY;
	const response = await fetch('https://api.web3forms.com/submit', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify({
			access_key: accessKey,
			subject: verificationState === 'verified'
				? 'Paid One-Task AI Plan intake'
				: 'One-Task AI Plan intake pending manual payment verification',
			from_name: 'Your AI Audit paid intake',
			plan: AI_AUDIT_OFFER_NAME,
			offer_key: AI_AUDIT_OFFER_ID,
			service_tier: AI_AUDIT_TIER,
			stripe_checkout_session_id: sessionId,
			verification_status: verificationState,
			...attribution,
			...intake,
			q7_outcomes: intake.q7_outcomes.join('; '),
			q8_constraints: intake.q8_constraints.join('; '),
		}),
	});
	const result = await response.json().catch(() => ({})) as { success?: boolean };
	return response.ok && result.success === true;
}

async function recordVerifiedIntake(paymentIntentId: string, submittedAt: string, stripeKey: string): Promise<boolean> {
	const params = new URLSearchParams();
	params.set('metadata[intake_submitted_at]', submittedAt);
	params.set('metadata[intake_verification_status]', 'verified');
	const response = await fetch('https://api.stripe.com/v1/payment_intents/' + encodeURIComponent(paymentIntentId), {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + stripeKey,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: params.toString(),
	});
	return response.ok;
}

async function sendVerifiedIntakeAnalytics(
	sessionId: string,
	attribution: IntakeAttribution,
): Promise<boolean> {
	const apiSecret = import.meta.env.GA4_API_SECRET;
	if (!apiSecret) return false;
	const measurementId = import.meta.env.GA4_MEASUREMENT_ID || 'G-1697T7D92W';
	const clientId = attribution.ga_client_id || `stripe.${sessionId}`;
	const params: Record<string, string | number | boolean> = {
		tier: AI_AUDIT_TIER,
		transaction_id: sessionId,
		payment_verified: true,
		verification_status: 'verified',
		event_id: `audit_intake_completed_${sessionId}`,
		engagement_time_msec: 1,
	};
	if (attribution.ga_session_id) params.session_id = attribution.ga_session_id;
	if (attribution.utm_campaign) params.campaign = attribution.utm_campaign;
	if (attribution.utm_content) params.ad_name = attribution.utm_content;
	if (attribution.utm_term) params.placement = attribution.utm_term;
	if (attribution.campaign_id) params.campaign_id = attribution.campaign_id;
	if (attribution.adset_id) params.adset_id = attribution.adset_id;
	if (attribution.ad_id) params.ad_id = attribution.ad_id;
	if (attribution.site_source_name) params.site_source_name = attribution.site_source_name;
	if (attribution.landing_session_id) params.landing_session_id = attribution.landing_session_id;

	const response = await fetch(
		`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				client_id: clientId,
				events: [{ name: 'ai_audit_intake_completed', params }],
			}),
		},
	);
	return response.ok;
}

export const POST: APIRoute = async ({ request }) => {
	if (!originAllowed(request)) {
		return json({ success: false, state: 'rejected', status: 'rejected', reason: 'origin_not_allowed' }, 403);
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, state: 'rejected', status: 'rejected', reason: 'invalid_json' }, 400);
	}

	const action = body.action;
	const sessionId = body.session_id;
	if (action !== 'verify' && action !== 'submit') {
		return json({ success: false, state: 'rejected', status: 'rejected', reason: 'invalid_action' }, 400);
	}

	const verification = await verifyAuditOrder(sessionId);
	if (action === 'verify') return json(verificationResponse(verification));
	if (verification.status === 'rejected') return json(verificationResponse(verification));

	const intake = cleanIntake(body.intake);
	if (!intake) {
		return json({ success: false, state: 'rejected', status: 'rejected', reason: 'invalid_intake' }, 400);
	}
	const attributionSource = body.attribution && typeof body.attribution === 'object'
		? body.attribution
		: body.intake;
	const attribution = cleanAttribution(attributionSource);

	if (verification.status === 'verified' && verification.order.paymentIntentMetadata.intake_submitted_at) {
		return json({
			success: true,
			state: 'verified',
			status: 'verified',
			submission_status: 'already_received',
			transaction_id: verification.order.sessionId,
		});
	}

	const state = verification.status === 'verified' ? 'verified' : 'pending_manual';
	const submitted = await relayToWeb3Forms(String(sessionId), intake, state, attribution);
	if (!submitted) {
		return json({
			success: false,
			state: 'rejected',
			status: 'rejected',
			verification_state: state,
			reason: 'intake_delivery_failed',
			message: 'Your answers could not be delivered. Try again or email maguirebaseball@gmail.com.',
		}, 502);
	}

	let auditRecorded = false;
	let analyticsSent = false;
	if (verification.status === 'verified') {
		const stripeKey = import.meta.env.STRIPE_AI_AUDIT_RESTRICTED_KEY;
		if (stripeKey) {
			auditRecorded = await recordVerifiedIntake(
				verification.order.paymentIntentId,
				new Date().toISOString(),
				stripeKey,
			);
			if (!auditRecorded) {
				console.error('[ai-audit-intake] Intake relayed but Stripe metadata update failed', verification.order.sessionId);
			}
		}
		analyticsSent = await sendVerifiedIntakeAnalytics(verification.order.sessionId, attribution);
		if (!analyticsSent) {
			console.error('[ai-audit-intake] Verified intake accepted but GA4 delivery failed', verification.order.sessionId);
		}
	}

	return json({
		success: true,
		state,
		status: state,
		submission_status: state === 'verified' ? 'accepted_verified' : 'accepted_pending_manual',
		transaction_id: String(sessionId),
		audit_recorded: auditRecorded,
		analytics_sent: analyticsSent,
	});
};
