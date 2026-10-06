import items from '../data/inner-child-questionnaire.json';
import { QUESTIONNAIRE_VERSION, responseLabels, type Answer, type PatternScore } from './innerChildQuestionnaire';

const WEB3FORMS_ACCESS_KEY = '0d5ededb-778b-452f-b8f0-72ebb2e4e461';

export type SubmissionData = {
	answers: Record<number, Answer>;
	scores: PatternScore[];
	completedAt: string;
};

export function buildSubmission(data: SubmissionData): Record<string, string | number | boolean> {
	const counts = { numeric: 0, N: 0, U: 0, S: 0, blank: 0 };
	for (const item of items) {
		const answer = data.answers[item.id] ?? null;
		if (typeof answer === 'number') counts.numeric++;
		else if (answer === 'N' || answer === 'U' || answer === 'S') counts[answer]++;
		else counts.blank++;
	}

	const scoreLines = data.scores.map((score) =>
		`${score.name}: ${score.mean === null ? 'Insufficient responses' : `${score.mean.toFixed(1)} out of 5`} (${score.answered}/8 numeric)`
	);
	const responseLines = items.map((item) => {
		const answer = data.answers[item.id] ?? null;
		const answerLabel = answer === null ? 'Unanswered' : `${answer}: ${responseLabels[String(answer)]}`;
		return `${String(item.id).padStart(2, '0')}. ${item.text}\n    ${answerLabel}`;
	});
	const message = [
		'Adult Relationship Patterns questionnaire',
		QUESTIONNAIRE_VERSION,
		`Completed: ${data.completedAt}`,
		`Responses: ${counts.numeric} numeric, ${counts.N} N, ${counts.U} U, ${counts.S} S, ${counts.blank} blank`,
		'',
		'Provisional pattern averages',
		...scoreLines,
		'',
		'Item responses',
		...responseLines,
		'',
		'These are unvalidated descriptive averages, not diagnoses or evidence of a childhood cause.',
	].join('\n');

	const payload: Record<string, string | number | boolean> = {
		access_key: WEB3FORMS_ACCESS_KEY,
		subject: 'Adult Relationship Patterns pilot submission',
		from_name: 'jackmaguire.org questionnaire',
		questionnaire_version: QUESTIONNAIRE_VERSION,
		completed_at_utc: data.completedAt,
		numeric_answers: counts.numeric,
		missing_N: counts.N,
		missing_U: counts.U,
		missing_S: counts.S,
		unanswered: counts.blank,
		message,
	};
	for (const score of data.scores) {
		const key = score.name.toLowerCase();
		payload[`${key}_mean`] = score.mean === null ? 'Insufficient responses' : score.mean.toFixed(1);
		payload[`${key}_answered`] = score.answered;
	}
	for (const item of items) {
		payload[`q${String(item.id).padStart(2, '0')}`] = data.answers[item.id] ?? 'Blank';
	}
	return payload;
}
