export const QUESTIONNAIRE_VERSION = 'Pilot 0.1';

export const responseLabels: Record<string, string> = {
	'1': 'Not at all true of me',
	'2': 'Slightly true of me',
	'3': 'Moderately true of me',
	'4': 'Very true of me',
	'5': 'Extremely true of me',
	N: 'Not applicable or no relevant situation',
	U: 'Unsure',
	S: 'Prefer to skip',
};

export type Answer = 1 | 2 | 3 | 4 | 5 | 'N' | 'U' | 'S' | null;

export const patterns = [
	{
		name: 'Frightened',
		ids: [1, 11, 14, 22, 28, 32, 37, 45],
		focus: 'Feeling threatened by closeness and pulling away to protect yourself.',
	},
	{
		name: 'Melancholic',
		ids: [5, 7, 13, 19, 30, 31, 40, 43],
		focus: 'Difficulty releasing attachments and accepting endings.',
	},
	{
		name: 'Ashamed',
		ids: [3, 8, 16, 21, 25, 33, 39, 48],
		focus: 'Feeling defective or protecting a threatened sense of worth.',
	},
	{
		name: 'Guilty',
		ids: [4, 12, 18, 23, 29, 35, 41, 47],
		focus: 'Taking excess responsibility for others and feeling guilty about your needs.',
	},
	{
		name: 'Invisible',
		ids: [6, 10, 17, 24, 26, 34, 38, 46],
		focus: 'Keeping your needs out of view or feeling unrecognized.',
	},
	{
		name: 'Chosen',
		ids: [2, 9, 15, 20, 27, 36, 42, 44],
		focus: 'Caregiver loyalty that constrains adult choices.',
	},
] as const;

export type PatternScore = {
	name: string;
	ids: readonly number[];
	focus: string;
	answered: number;
	mean: number | null;
};

export function scoreResponses(answers: Record<number, Answer>): PatternScore[] {
	return patterns.map((pattern) => {
		const numeric = pattern.ids
			.map((id) => answers[id])
			.filter((answer): answer is 1 | 2 | 3 | 4 | 5 => typeof answer === 'number' && answer >= 1 && answer <= 5);
		return {
			...pattern,
			answered: numeric.length,
			mean: numeric.length >= 6 ? numeric.reduce((sum, value) => sum + value, 0) / numeric.length : null,
		};
	});
}
