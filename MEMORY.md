# Memory

Append dated summaries of meaningful site changes, deployments, indexing work, and durable content decisions. Link to changed files and live validation. Do not paste build logs.

## 2026-07-28, Legacy route redirects

Added permanent Vercel redirects from `/start/` to `/about/` and `/projects/` to `/blog/`. Local build passed before deployment.

## 2026-07-17, Knowledge system completion

Added canonical brain, current state, references, resources, and wiki navigation around the existing Git repository, README, agent rules, and Google Places skill.

## 2026-07-17, Evan July 17 bar field guide

Added the standalone interactive visual field guide at `src/pages/evanjuly17.astro`. It presents seven Lower Manhattan Saturday-night options, a practical three-stop route, selection criteria, venue links, maps, and responsive editorial design. Built successfully and deployed through the normal GitHub to Vercel flow. The canonical live domain configured for this repository is `jackmaguire.org`, not `jackmaguire.com`.

## 2026-07-17, Conversations with Tyler retrospective visual report

Added `src/pages/tylercowen-retro.astro`, a standalone visual report at `/tylercowen-retro/`. It translates the 2019–2025 retrospective audit into a responsive editorial page with a seven-year ledger, three outcome cards, three ranked dimension-effect charts, an outlier scatter plot, a codebook, method notes, and official retrospective links. Added a bespoke social preview at `public/tylercowen-retro-og.png`. Local build, indexing check, and browser visual review passed before deployment.

## 2026-07-17, Conversations with Tyler reproducible panel revision

Replaced the report's untraceable illustrative effect scores with a reproducible descriptive analysis. The public panel has 61 retrospective episode-year mentions, 58 distinct guests, three separately defined binary outcomes, 35 observed features, and 27 explicitly unobserved transcript or audio measures. `scripts/analyze-tyler-retro.mjs` generates the analysis artifact using unadjusted percentage-point contrasts and deterministic 80% bootstrap intervals, suppresses sparse comparisons, and withholds the tautological host-enthusiasm versus Tyler-praise comparison. The page now exposes the 62-row operational codebook, source CSV, analysis JSON, exact method, limitations, and official retrospective links. Local build, indexing check, DOM coverage check, and browser visual review passed before deployment.

## 2026-07-17, Conversations with Tyler 2026 guest forecast

Extended `src/pages/tylercowen-retro.astro` with a prospective guest slate built from 793 primary-source items: 500 recent Marginal Revolution entries and 293 CWT archive entries. The page now presents six first-outreach choices, two ranked 25-person lists, a 22-name overlap view, transparent forecast weights, exact screening limits, and downloadable forecast, source-ledger, and exclusion-screen files. Updated the social preview to name the 2026 guest forecast. The local build, indexing check, content assertions, and prohibited-dash scan passed before deployment.

## 2026-07-22, Causal inference with AI for beginners

Added the root-level plain article shell `src/pages/causal-inference-with-AI-for-beginners.astro` and its Markdown body, published at `/causal-inference-with-AI-for-beginners/`. It explains how business owners can use AI to model a lead funnel without confusing prediction with causation, including DAG construction, leakage controls, maturity windows, a small-sample workflow, and experimentation. The local build and indexing checks passed before deployment.

## 2026-07-24, Private maxxing report

Published the standalone personal appearance report at `/maxxing/` without adding it to site navigation, RSS, or the generated sitemap. The page and image assets live under `public/maxxing/`. Indexing controls include page-level directives for major crawlers, a Vercel `X-Robots-Tag` header, `noimageindex`, `noarchive`, `nosnippet`, a no-referrer policy, and `Disallow: /maxxing/` in `robots.txt`.

Production validation passed: the route and four images returned HTTP 200, the live response included the expected crawler and referrer headers, the live page contained the matching meta directives, and `/maxxing/` was absent from the live sitemap. Public noindex reduces discovery and indexing but does not provide authentication or guarantee the absence of server logs.

## 2026-07-24, Maxxing procedure option map

Extended `/maxxing/` with a photograph-bounded plastic-surgery and office-procedure option map. The page ranks fractional resurfacing as the clearest visible procedural target, treats forehead neuromodulator as a possible consultation, places rhinoplasty and lower blepharoplasty in consult-only tiers, and explains why chin, jaw, buccal-fat, neck-lift, brow-lift, facelift, and transplant procedures appear poorly matched to the supplied images. It also flags nasal filler and RF microneedling risks and adds a two-surgeon consultation protocol.

The extension is explicitly non-diagnostic and cites systematic reviews, FDA safety material, and American Society of Plastic Surgeons guidance. Local build, internal-reference validation, 42-link checks, image checks, and prohibited-dash checks passed. Existing noindex, crawler-header, robots, sitemap-exclusion, and referrer controls were preserved.

## 2026-07-28, Professional about page

Added `src/pages/professional-about-me.astro` at `/professional-about-me/`. The page strategy is grounded in a review of 47 tailored role records from the ResumeAutomation project. It prioritizes the recurring requirements across those roles: paid social and media depth, Meta and TikTok execution, measurement, creative testing, budget ownership, profitability, acquisition, cross-functional leadership, signal infrastructure, executive communication, hands-on work, and AI-enabled operations.

The page uses a field-notebook and performance-dashboard visual system built from the site's paper, olive, black, and restrained red palette. It preserves the normal header and footer and includes quantified career proof, a capability map, career timeline, operating principles, selected professional writing, personal context, contact links, Person schema, canonical metadata, and a bespoke social preview. The page route prerendered successfully and required content, metadata, and prohibited-dash checks passed. The Windows local build reached completed route generation; final Vercel function packaging could not create a package-manager symlink locally, which does not affect the repository's normal Linux-based Vercel deployment.

## 2026-07-28, Professional bio contact and discovery update

Changed the professional page contact address and rendered it as a PNG rather than machine-readable page text. The address is absent from the page HTML, structured data, links, filenames, and alternative text. Added the page to global navigation as `Professional Bio`. Added explicit index, follow, snippet, and image-preview directives, retained sitemap inclusion, and explicitly allowed major search and AI crawler user agents while preserving the private `/maxxing/` exclusion.

## 2026-07-28, Homepage Person schema

Added the canonical Person entity to the homepage at `https://jackmaguire.org/#jack`. It includes the confirmed professional portrait, title, New York address, McGill education, National Debt Relief employment, paid-social and measurement expertise, and the verified LinkedIn and Instagram profiles.

## 2026-07-28, Route indexing cleanup

Moved two raw Markdown article bodies out of `src/pages` so Astro no longer emits their `.content/` URLs or includes them in the sitemap. Normalized the causal-inference article to the lowercase route and added a permanent redirect from the former mixed-case URL. The existing permanent redirect from the indexed dated three-martini URL remains in place.

## 2026-07-28, Entity and authorship consolidation

Established `https://jackmaguire.org/#jack` as the sole full Person entity on the homepage. About, professional, and CMO pages now reference that node rather than redefining it. The homepage now uses the current LinkedIn profile, a consistent paid-social title, portrait, and visible LinkedIn link. Standard blog layouts and custom blog routes emit BlogPosting metadata with the canonical author ID. Sitemap generation now includes lastmod values and excludes private, thank-you, and personal one-off routes.
