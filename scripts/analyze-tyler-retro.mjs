import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = process.argv[2];

if (!inputPath) {
  throw new Error('Usage: node scripts/analyze-tyler-retro.mjs <episode_codes.csv>');
}

const codebook = [
  ['guest_fame', 'Guest and distribution', 'Guest fame', 'Guest is coded high-fame in the retrospective.', 'coded'],
  ['repeat_guest', 'Guest and distribution', 'Repeat guest', 'Guest had appeared on CWT before this episode-year.', 'coded'],
  ['topic_AI', 'Topic', 'AI', 'Primary subject includes artificial intelligence.', 'coded'],
  ['topic_politics', 'Topic', 'Politics / policy', 'Primary subject includes politics, policy, intelligence, defense, race, or geopolitics.', 'coded'],
  ['topic_economics', 'Topic', 'Economics / finance', 'Primary subject includes economics, finance, labor, or investing.', 'coded'],
  ['topic_history', 'Topic', 'History', 'Primary subject includes history, archaeology, or a historical geography.', 'coded'],
  ['topic_science', 'Topic', 'Science / psychology', 'Primary subject includes science, psychology, or statistics.', 'coded'],
  ['topic_arts', 'Topic', 'Visual arts / poetry', 'Primary subject includes visual art, painting, or poetry.', 'coded'],
  ['topic_literature', 'Topic', 'Literature', 'Primary subject includes literature, translation, or fiction.', 'coded'],
  ['topic_music', 'Topic', 'Music', 'Primary subject includes music, Bach, the Beatles, or classical music.', 'coded'],
  ['topic_religion', 'Topic', 'Religion', 'Primary subject includes religion or Buddhism.', 'coded'],
  ['topic_sports', 'Topic', 'Sports / competition', 'Primary subject includes sports, chess, ultramarathon, or competition.', 'coded'],
  ['topic_technology', 'Topic', 'Technology', 'Primary subject includes technology, AI, YouTube, or aviation.', 'coded'],
  ['topic_geography', 'Topic', 'Geography', 'Primary subject includes a named region or country.', 'coded'],
  ['single_subject', 'Conversation design', 'Single subject', 'The episode has one explicit intellectual object or question.', 'coded'],
  ['debate_pushback', 'Conversation design', 'Debate / pushback', 'Retrospective tags show serious disagreement or a combative exchange.', 'coded'],
  ['controversy', 'Conversation design', 'Controversy', 'The episode was described as controversial or polarizing.', 'coded'],
  ['authenticity', 'Human texture', 'Authenticity', 'The retrospective describes unguarded, unpolished, or non-performative answers.', 'coded'],
  ['emotional_disclosure', 'Human texture', 'Emotional disclosure', 'The retrospective records personally consequential disclosure.', 'coded'],
  ['humor', 'Human texture', 'Humor', 'The retrospective records humor as a meaningful feature.', 'coded'],
  ['novelty', 'Human texture', 'Novelty', 'The retrospective signals a surprising premise, person, or subject.', 'coded'],
  ['practical_utility', 'Conversation design', 'Practical utility', 'The retrospective tags a concrete, usable implication.', 'coded'],
  ['expertise_depth', 'Conversation design', 'Expertise depth', 'The guest is tagged for specialist knowledge or a singular subject.', 'coded'],
  ['obscurity', 'Guest and distribution', 'Obscurity', 'The retrospective frames the guest as underrated or outside the obvious fame pool.', 'coded'],
  ['institutional_access', 'Guest and distribution', 'Institutional access', 'The guest offers unusual access to an institution or state actor.', 'coded'],
  ['female_guest', 'Guest and distribution', 'Female guest', 'Guest gender, hand-coded only for descriptive balance checks.', 'coded'],
  ['accent_or_audio_friction', 'Production', 'Accent / audio friction', 'The retrospective calls out accent comprehension or rough audio.', 'coded'],
  ['rapport', 'Human texture', 'Rapport', 'The retrospective identifies host-guest rapport as salient.', 'coded'],
  ['host_enthusiasm', 'Human texture', 'Host enthusiasm', "Tyler's retrospective language scores the exchange as a strong personal success.", 'coded'],
  ['prep_intensity', 'Conversation design', 'Preparation intensity', 'Requires episode transcript and prep materials, not coded in this panel.', 'not_observed'],
  ['narrative_arc', 'Conversation design', 'Narrative arc', 'Requires full transcript or listening notes, not coded in this panel.', 'not_observed'],
  ['unexpected_ending', 'Conversation design', 'Unexpected ending', 'The retrospective identifies a closing turn that readers or listeners repeat.', 'coded'],
  ['fast_answers', 'Conversation design', 'Fast answers', 'The retrospective describes unusually quick, concrete answers.', 'coded'],
  ['long_runtime', 'Production', 'Long runtime', 'The episode is tagged long relative to the CWT format.', 'coded'],
  ['live_or_panel', 'Production', 'Live / panel format', 'The episode was recorded live or as a panel.', 'coded'],
  ['social_media_reach', 'Guest and distribution', 'Social distribution', 'Retrospective tags document a notable social or YouTube distribution channel.', 'coded'],
  ['production_quality', 'Production', 'Production quality', 'The retrospective flags a material audio-quality issue or its absence.', 'coded'],
  ['question_density', 'Transcript measurement', 'Question density', 'Tyler questions per 1,000 transcript words.', 'not_observed'],
  ['follow_up_density', 'Transcript measurement', 'Follow-up density', 'Follow-up questions per 1,000 Tyler words.', 'not_observed'],
  ['why_question_rate', 'Transcript measurement', 'Why-question rate', 'Share of Tyler questions beginning with or functioning as why questions.', 'not_observed'],
  ['what_do_you_really_think_rate', 'Transcript measurement', 'Pressure-question rate', 'Rate of direct belief-probing questions, including “what do you really think?”.', 'not_observed'],
  ['production_function_phrase', 'Transcript measurement', 'Production-function prompts', 'Count of prompts that ask how an outcome is produced.', 'not_observed'],
  ['first_person_rate', 'Transcript measurement', 'First-person rate', 'First-person pronouns per 1,000 speaker words.', 'not_observed'],
  ['hedging_rate', 'Transcript measurement', 'Hedge rate', 'Hedges per 1,000 speaker words.', 'not_observed'],
  ['certainty_rate', 'Transcript measurement', 'Certainty rate', 'High-certainty terms per 1,000 speaker words.', 'not_observed'],
  ['counterfactual_rate', 'Transcript measurement', 'Counterfactual rate', 'Counterfactual constructions per 1,000 speaker words.', 'not_observed'],
  ['numbers_rate', 'Transcript measurement', 'Numbers rate', 'Numbers per 1,000 speaker words.', 'not_observed'],
  ['proper_noun_density', 'Transcript measurement', 'Proper-noun density', 'Named entities per 1,000 speaker words.', 'not_observed'],
  ['named_example_rate', 'Transcript measurement', 'Named-example rate', 'Concrete named examples per 1,000 speaker words.', 'not_observed'],
  ['technical_jargon_rate', 'Transcript measurement', 'Technical-jargon rate', 'Domain terms per 1,000 speaker words.', 'not_observed'],
  ['plain_language_rate', 'Transcript measurement', 'Plain-language rate', 'Share of words below a pre-registered reading-complexity threshold.', 'not_observed'],
  ['metaphor_rate', 'Transcript measurement', 'Metaphor rate', 'Hand-checked metaphoric constructions per 1,000 speaker words.', 'not_observed'],
  ['analogy_rate', 'Transcript measurement', 'Analogy rate', 'Explicit analogies per 1,000 speaker words.', 'not_observed'],
  ['negative_polarity', 'Transcript measurement', 'Negative polarity', 'Negative-sentiment terms per 1,000 speaker words.', 'not_observed'],
  ['positive_polarity', 'Transcript measurement', 'Positive polarity', 'Positive-sentiment terms per 1,000 speaker words.', 'not_observed'],
  ['surprise_markers', 'Transcript measurement', 'Surprise markers', 'Surprise expressions per 1,000 speaker words.', 'not_observed'],
  ['laughter_markers', 'Transcript measurement', 'Laughter markers', 'Transcript laughter markers per 1,000 speaker words.', 'not_observed'],
  ['interruption_rate', 'Transcript measurement', 'Interruption rate', 'Overlaps or interruptions per hour from speaker diarization.', 'not_observed'],
  ['short_answer_rate', 'Transcript measurement', 'Short-answer rate', 'Guest answers under a pre-registered word threshold.', 'not_observed'],
  ['long_sentence_rate', 'Transcript measurement', 'Long-sentence rate', 'Sentences above a pre-registered word threshold.', 'not_observed'],
  ['food_travel_aside_rate', 'Transcript measurement', 'Food / travel asides', 'Food or travel digressions per hour.', 'not_observed'],
  ['guest_specific_lexicon', 'Transcript measurement', 'Guest-specific lexicon', 'Distinctive vocabulary after matching on topic and guest background.', 'not_observed'],
];

const raw = fs.readFileSync(inputPath, 'utf8').trim().split('\n').map((line) => line.replace(/\r$/, '').split(','));
const [header, ...values] = raw;
const rows = values.map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ''])));

function mulberry32(seed) {
  return () => {
    let value = (seed += 0x6D2B79F5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function bootstrapDifference(present, absent, seed) {
  const random = mulberry32(seed);
  const draws = [];
  for (let draw = 0; draw < 5000; draw += 1) {
    let presentTotal = 0;
    let absentTotal = 0;
    for (let index = 0; index < present.length; index += 1) presentTotal += present[Math.floor(random() * present.length)];
    for (let index = 0; index < absent.length; index += 1) absentTotal += absent[Math.floor(random() * absent.length)];
    draws.push((presentTotal / present.length - absentTotal / absent.length) * 100);
  }
  draws.sort((left, right) => left - right);
  return [Math.round(draws[499]), Math.round(draws[4499])];
}

const outcomes = [
  { key: 'acquisition', label: 'Acquisition', definition: 'Mentioned in a retrospective top-download list.', value: (row) => Number(row.download_rank) > 0 },
  { key: 'affection', label: 'Audience affection', definition: 'Retrospective contains a direct listener-favorite, retention, or repeated-listener signal.', value: (row) => Number(row.audience_love_proxy) > 0 },
  { key: 'tyler', label: 'Strong Tyler pick', definition: 'Tyler-enjoyment proxy equals 3, the strongest retrospective praise code.', value: (row) => Number(row.tyler_enjoyment_proxy) === 3 },
];

const dimensions = codebook.map(([key, group, label, definition, state], dimensionIndex) => {
  const excludedOutcomes = key === 'host_enthusiasm' ? ['tyler'] : [];
  const base = { key, group, label, definition, state, excludedOutcomes };
  if (state !== 'coded') return base;

  const presentRows = rows.filter((row) => Number(row[key]) === 1);
  const absentRows = rows.filter((row) => Number(row[key]) !== 1);
  const support = { present: presentRows.length, absent: absentRows.length };
  const sparse = Math.min(support.present, support.absent) < 4;
  const effects = Object.fromEntries(outcomes.map((outcome, outcomeIndex) => {
    if (excludedOutcomes.includes(outcome.key)) {
      return [outcome.key, { notApplicable: true }];
    }
    const present = presentRows.map((row) => Number(outcome.value(row)));
    const absent = absentRows.map((row) => Number(outcome.value(row)));
    const ratePresent = Math.round(mean(present) * 100);
    const rateAbsent = Math.round(mean(absent) * 100);
    return [outcome.key, {
      presentRate: ratePresent,
      absentRate: rateAbsent,
      differencePp: ratePresent - rateAbsent,
      interval80: sparse ? null : bootstrapDifference(present, absent, 20260717 + dimensionIndex * 31 + outcomeIndex),
    }];
  }));
  return { ...base, support, sparse, effects };
});

const analysis = {
  generatedAt: '2026-07-17',
  panel: {
    unit: 'retrospective episode-year mention',
    rows: rows.length,
    distinctGuests: new Set(rows.map((row) => row.guest)).size,
    years: [...new Set(rows.map((row) => Number(row.year)))],
    selection: 'The annual retrospectives select notable episodes. This is not the full CWT episode universe.',
  },
  outcomes: outcomes.map((outcome) => ({
    key: outcome.key,
    label: outcome.label,
    definition: outcome.definition,
    events: rows.filter(outcome.value).length,
    rate: Math.round(rows.filter(outcome.value).length / rows.length * 100),
  })),
  estimation: {
    estimator: 'unadjusted difference in descriptive outcome rates, feature present minus feature absent',
    uncertainty: '5,000 deterministic nonparametric bootstrap resamples, 80% percentile interval, seed 20260717',
    suppression: 'Intervals are withheld when either feature group has fewer than four rows.',
    limitation: 'Features and outcomes are hand-coded from the same retrospective documents. Estimates are descriptive enrichments in a selected sample, not causal effects, predictive model coefficients, or podcast-wide rates.',
  },
  dimensions,
};

const destinations = [
  path.join(siteRoot, 'src/data/tyler-retro-analysis.json'),
  path.join(siteRoot, 'public/data/tyler-retro-analysis.json'),
];

for (const destination of destinations) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(analysis, null, 2)}\n`);
}

const panelDestination = path.join(siteRoot, 'public/data/tyler-retro-panel.csv');
fs.mkdirSync(path.dirname(panelDestination), { recursive: true });
fs.copyFileSync(inputPath, panelDestination);

console.log(JSON.stringify({ rows: rows.length, dimensions: dimensions.length, output: destinations }, null, 2));
