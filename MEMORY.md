# Memory

Append dated summaries of meaningful site changes, deployments, indexing work, and durable content decisions. Link to changed files and live validation. Do not paste build logs.

## 2026-07-17, Knowledge system completion

Added canonical brain, current state, references, resources, and wiki navigation around the existing Git repository, README, agent rules, and Google Places skill.

## 2026-07-17, Evan July 17 bar field guide

Added the standalone interactive visual field guide at `src/pages/evanjuly17.astro`. It presents seven Lower Manhattan Saturday-night options, a practical three-stop route, selection criteria, venue links, maps, and responsive editorial design. Built successfully and deployed through the normal GitHub to Vercel flow. The canonical live domain configured for this repository is `jackmaguire.org`, not `jackmaguire.com`.

## 2026-07-17, Conversations with Tyler retrospective visual report

Added `src/pages/tylercowen-retro.astro`, a standalone visual report at `/tylercowen-retro/`. It translates the 2019–2025 retrospective audit into a responsive editorial page with a seven-year ledger, three outcome cards, three ranked dimension-effect charts, an outlier scatter plot, a codebook, method notes, and official retrospective links. Added a bespoke social preview at `public/tylercowen-retro-og.png`. Local build, indexing check, and browser visual review passed before deployment.

## 2026-07-17, Conversations with Tyler reproducible panel revision

Replaced the report's untraceable illustrative effect scores with a reproducible descriptive analysis. The public panel has 61 retrospective episode-year mentions, 58 distinct guests, three separately defined binary outcomes, 35 observed features, and 27 explicitly unobserved transcript or audio measures. `scripts/analyze-tyler-retro.mjs` generates the analysis artifact using unadjusted percentage-point contrasts and deterministic 80% bootstrap intervals, suppresses sparse comparisons, and withholds the tautological host-enthusiasm versus Tyler-praise comparison. The page now exposes the 62-row operational codebook, source CSV, analysis JSON, exact method, limitations, and official retrospective links. Local build, indexing check, DOM coverage check, and browser visual review passed before deployment.
