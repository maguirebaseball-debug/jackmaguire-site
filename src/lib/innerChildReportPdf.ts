import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { QUESTIONNAIRE_VERSION, responseLabels, type Answer, type PatternScore } from './innerChildQuestionnaire';

type Item = { id: number; text: string };

export type ReportData = {
	answers: Record<number, Answer>;
	scores: PatternScore[];
	items: Item[];
	date: string;
	caregiver: string;
	clientCode: string;
};

export async function downloadReportPdf(report: ReportData): Promise<void> {
	const pdf = await PDFDocument.create();
	pdf.setTitle('Adult Relationship Patterns: Personal Report');
	pdf.setSubject('Pilot reflection questionnaire report');
	pdf.setCreator('jackmaguire.org');
	const regular = await pdf.embedFont(StandardFonts.Helvetica);
	const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
	const ink = rgb(0.13, 0.17, 0.17);
	const muted = rgb(0.35, 0.39, 0.39);
	const olive = rgb(0.27, 0.35, 0.14);
	const width = 612;
	const height = 792;
	const left = 58;
	const right = width - left;
	let page: PDFPage;
	let y = 0;

	function newPage() {
		page = pdf.addPage([width, height]);
		y = height - 62;
		page.drawText('JACKMAGUIRE.ORG  /  QUESTIONNAIRE', {
			x: left, y: height - 34, size: 8, font: bold, color: olive,
		});
		page.drawLine({ start: { x: left, y: height - 43 }, end: { x: right, y: height - 43 }, thickness: 0.6, color: muted });
	}

	function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
		const lines: string[] = [];
		let line = '';
		for (const word of text.split(/\s+/)) {
			const candidate = line ? `${line} ${word}` : word;
			if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
				line = candidate;
			} else {
				lines.push(line);
				line = word;
			}
		}
		if (line) lines.push(line);
		return lines;
	}

	function paragraph(text: string, options: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; gap?: number; indent?: number } = {}) {
		text = text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7e]/g, '?');
		const size = options.size ?? 10.5;
		const font = options.font ?? regular;
		const color = options.color ?? ink;
		const indent = options.indent ?? 0;
		const lines = wrap(text, font, size, right - left - indent);
		const lineHeight = size * 1.42;
		if (y - lines.length * lineHeight - (options.gap ?? 8) < 58) newPage();
		for (const line of lines) {
			page.drawText(line, { x: left + indent, y, size, font, color });
			y -= lineHeight;
		}
		y -= options.gap ?? 8;
	}

	function heading(text: string) {
		if (y < 115) newPage();
		y -= 5;
		paragraph(text, { size: 13, font: bold, color: olive, gap: 8 });
	}

	newPage();
	paragraph('Adult Relationship Patterns', { size: 22, font: bold, gap: 2 });
	paragraph('Your questionnaire report', { size: 14, color: muted, gap: 18 });
	paragraph(`${QUESTIONNAIRE_VERSION}  |  ${report.date}`, { size: 10, color: muted, gap: 5 });
	if (report.clientCode) paragraph(`Client code: ${report.clientCode}`, { size: 10, color: muted, gap: 5 });
	paragraph(`Caregiver reference: ${report.caregiver || 'Not provided'}`, { size: 10, color: muted, gap: 18 });
	paragraph('This unvalidated pilot is for reflection and discussion. A score is a provisional average of responses to these statements. It is not a diagnosis, percentile, probability, amount of childhood harm, or evidence of what caused a pattern.', { gap: 14 });
	paragraph('Each pattern is scored only when at least 6 of its 8 items have numeric answers. N, U, S, and unanswered items are missing and never count as low or middle ratings. Do not compare small differences between patterns or use this report to make treatment, eligibility, or employment decisions.', { gap: 18 });

	heading('Six provisional pattern averages');
	for (const score of report.scores) {
		const result = score.mean === null
			? `Insufficient responses (${score.answered}/8 numeric answers).`
			: `${score.mean.toFixed(1)} out of 5 (${score.answered}/8 numeric answers).`;
		paragraph(`${score.name}: ${result}`, { font: bold, gap: 2 });
		paragraph(score.focus, { size: 9.5, color: muted, gap: 9 });
	}

	heading('Questions for reflection');
	for (const question of [
		'Which answer would you most like to explain?',
		'In what situations does that pattern help you, and when does it create difficulty?',
		'Does it connect with an earlier experience, or does another explanation fit better?',
		'What would you like to respond to differently now?',
	]) paragraph(question, { size: 10, gap: 4 });

	heading('Your responses');
	for (const item of report.items) {
		const answer = report.answers[item.id] ?? null;
		const label = answer === null ? 'Unanswered' : `${answer}: ${responseLabels[String(answer)]}`;
		const lines = wrap(`${item.id}. ${item.text}`, regular, 10, right - left);
		if (y - lines.length * 14.2 - 24 < 58) newPage();
		paragraph(`${item.id}. ${item.text}`, { size: 10, gap: 2 });
		paragraph(`Answer: ${label}`, { size: 9, color: muted, gap: 9, indent: 14 });
	}

	const pages = pdf.getPages();
	pages.forEach((p, index) => {
		p.drawLine({ start: { x: left, y: 47 }, end: { x: right, y: 47 }, thickness: 0.6, color: muted });
		p.drawText(`${QUESTIONNAIRE_VERSION}  |  Page ${index + 1} of ${pages.length}`, { x: left, y: 32, size: 8, font: regular, color: muted });
	});

	const bytes = await pdf.save();
	const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = `adult-relationship-patterns-report-${new Date().toISOString().slice(0, 10)}.pdf`;
	document.body.append(anchor);
	anchor.click();
	anchor.remove();
	setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
