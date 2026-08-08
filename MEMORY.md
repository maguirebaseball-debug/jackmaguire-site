# Memory

Append dated summaries of meaningful site changes, deployments, indexing work, and durable content decisions. Link to changed files and live validation. Do not paste build logs.

## 2026-08-08, AI Audit CRO and funnel instrumentation

Hardened the AI Audit funnel in commit `a3c1b97`. Added GA4's standard `begin_checkout` event alongside the custom checkout-start event, requested beacon transport for funnel events during redirects, and decoupled server-side GA4 purchase delivery from Meta CAPI delivery in `src/pages/api/stripe-ai-audit.ts`. Purchases now remain visible in GA4 if Meta rejects or lacks its token, and direct or otherwise unattributed purchases use a deterministic fallback client ID. GitHub push to `main` completed; local build verification was unavailable because Node/npm is not installed on the current Windows PATH.

Reworked `/Your-AI-Audit/` for early conversion clarity: the hero now promises a first workflow projected to save 30 minutes per week, the three paid tiers appear near the top, alternatives and the cost of guessing are explicit, and the empty proof placeholder is replaced with a diagnosis and risk explanation. Clarified the refund guarantee language across the offer ladder. Added GA4 browser events for CTA clicks, checkout starts, post-Stripe returns, intake starts, halfway progress, and intake completion in `src/pages/Your-AI-Audit.astro` and `src/pages/Your-AI-Audit/start.astro`. Kept Meta `Purchase` optimization unchanged because server-confirmed Stripe to Meta tracking is already the correct signal at current spend. Local route generation completed; final local Vercel packaging remains blocked by the known Windows `sharp` symlink limitation.

Added the optional GA4 server-confirmed purchase connection. The landing page extracts the first-party `_ga` client ID and carries it through the existing Stripe `client_reference_id` attribution envelope. The signed Stripe webhook can now send a standard GA4 `purchase` event with transaction ID, tier, value, and currency when `GA4_API_SECRET` is present. The secret is not present yet, so Meta remains the active server-side purchase destination.

## 2026-08-07, signed Stripe to Meta Purchase tracking

Expanded the AI Audit purchase webhook to cover the $79 Snapshot, $199 Mini Audit, and $499 Full Audit. Replaced the URL-token destination with a Stripe-signature-verified live endpoint subscribed only to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. The retired token endpoint was disabled in Stripe.

Checkout clicks now pass Meta `_fbp` and `_fbc` identifiers through Stripe's `client_reference_id`, and the webhook validates and forwards them with the hashed checkout email and Stripe customer ID. Meta receives the correct tier value, currency, content ID, order ID, and stable event ID for deduplication.

Validated the complete signed endpoint with Meta dataset `1578848813945108` and Test Events code `TEST97456`. The server accepted a signed simulated $79 Checkout completion and Meta accepted the test Purchase. The test code was removed from production immediately afterward so real purchases remain live optimization events.

## 2026-08-07, AI Bottleneck Snapshot checkout and intake

Created the live Stripe product, one-time $79 price, hosted Payment Link, and narrowly scoped webhook for the AI Bottleneck Snapshot. The checkout collects the buyer name and email, sends an automatic Stripe receipt, and redirects successful buyers to `/Your-AI-Audit/start/` with the Checkout Session ID and campaign parameters.

Added the paid Snapshot intake as a four-step, eight-question form with inline validation, conditional fields, sensitive-data warnings, projection acknowledgement, and a one-business-day confirmation. The form sends structured answers and the Stripe session reference through the existing Web3Forms destination. The route is noindex and excluded from the sitemap.

Added the server-side purchase event path. Stripe completions must be live, paid, $79 USD, and tagged with the Snapshot offer metadata before the endpoint sends Meta `Purchase`. The Stripe Checkout Session ID is the stable event key for retry deduplication. Intake progress uses custom events and never fires `Lead` or `Purchase`. Updated Meta Graph calls to v25.0 and expanded the privacy policy for the paid service flow.

## 2026-08-06, Your AI Audit landing page

Added the standalone conversion page `/Your-AI-Audit/` for a $999 personalized AI tools assessment. The page presents the five-hour weekly savings guarantee, quick-win selection matrix, three-step assessment process, five-part report, typical time and tool-cost outcomes, and an embedded Web3Forms booking request. It uses a focused editorial design derived from the site's paper palette with black, chartreuse, and cobalt accents, plus a matching social preview. Local route generation, HTTP response, metadata, form presence, and prohibited-dash checks passed. The known Windows Vercel adapter symlink limitation remains at final local packaging, so production deployment continues through the normal GitHub to Vercel flow.

## 2026-08-06, Your AI Audit paid offer ladder

Replaced the single $999 booking request with three paid starting points: a $79 AI Bottleneck Snapshot, a $199 Quick-Win Mini Audit, and a $499 Full AI Audit. The page now compares scope, turnaround, deliverables, upgrade credits, and guarantee coverage before the long-form explanation. The full fee from each lower tier applies to the next tier for 30 days. The five-hour refund guarantee applies only to the Full AI Audit.

Added environment-backed secure checkout hooks for all three products and a temporary email fallback when a checkout destination is not configured. Real checkout clicks send `InitiateCheckout`, not `Purchase`; confirmed payment remains the required source for a purchase event. Reclassified three-page, two-minute visitors as `EngagedVisitor` and Instagram clickouts as `InstagramClickout`, preventing those soft behaviors from inflating Meta leads. Added a matching three-tier social preview. Local prerendering and content assertions passed; the known Windows Vercel adapter symlink error remained limited to final local function packaging.

## 2026-08-06, Your AI Audit guarantee ladder

Added a scope-matched automatic-refund guarantee to every paid tier. The $79 Snapshot must identify one practical change projected to save at least 30 minutes per week, the $199 Mini Audit must identify at least two hours per week, and the $499 Full Audit must identify at least five hours per week. The page now defines projected weekly savings as current task time minus expected post-implementation task time, subtracts new oversight, excludes duplicated or transferred time, and clarifies that the guarantee covers the diagnostic opportunity rather than results dependent on implementation.

## 2026-08-06, Your AI Audit deliverable clarity

Reframed every pricing card around the artifact the buyer receives. The $79 tier delivers a one-page Snapshot PDF after an eight-question intake, the $199 tier delivers a three-page Action Memo PDF after a 25-minute call, and the $499 tier delivers a complete Custom AI Audit PDF plus a 30-minute review after a 45-minute discovery call. Each card now separates the named deliverable, report contents, buyer input, delivery timing, guarantee, and upgrade credit.

## 2026-08-06, AI bottleneck corpus

Added the root-level plain article `/bottleneck/`, based on a purposive corpus of 100 publicly readable Substack articles that diagnose a non-model AI constraint. The page keeps the complete coded ledger, method, result table, interpretation, and caveats. It is registered in `src/lib/standaloneBlogPosts.ts`, which places it on the homepage, `/blog/`, RSS, and the generated sitemap.

## 2026-07-28, Legacy route redirects

Added HTTP 301 Vercel redirects from `/start/` to `/about/` and `/projects/` to `/blog/`. Local build passed before deployment.

## 2026-07-28, Canonical identity and WordPress redirect consolidation

Made `/about/` the canonical identity URL throughout site navigation and standard blog bylines. Normalized all generated internal page links to trailing-slash URLs and verified the prerendered site has no unresolved or non-trailing-slash internal page links. Added permanent Vercel redirects for dated 2026 WordPress post URLs, `/category/*`, and `/appalachian-trail-thru-hike-thoughts/` to their current destinations. Astro already enforces `trailingSlash: 'always'`.

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

## 2026-07-29, ProfilePage mainEntity structured-data repair

Updated `/about/` and `/professional-about-me/` so each ProfilePage declares `mainEntity` as a Person with the shared canonical Person ID and name. This fixes the two Search Console examples that reported an invalid object type for `mainEntity`.

## 2026-07-31, Kind rejection essay

Added the plain Markdown essay `src/content/blog/kind-rejection-approach.md`, an anthropological reading of dating-app norms, polished rejection language, self-awareness, and emotional risk management. The draft uses personal context from Notion pages about digital contact, ambiguity, optimization, and dating with honesty rather than performance. Added the peer-reviewed source ledger at `research/kind-rejection-approach.md`. Prohibited-dash and whitespace checks passed; Astro build and indexing checks could not run because Node/npm are unavailable in the local PowerShell environment.

## 2026-08-04, Amex candidacy landing page

Added the private standalone page `src/pages/amex-nyc-hireme.astro` for the American Express Senior Analyst, Social Execution and Channel Management application. The page uses American Express Business-inspired visual direction based on blue, deep blue, neutrals, modular utility layout, and Benton Sans fallback typography, without official logos or endorsement language. Added page-level noindex tags, Vercel `X-Robots-Tag` headers, `Referrer-Policy`, sitemap exclusion, and `robots.txt` disallow rules. Local Astro route generation reached the Amex page, but the Windows environment hit the previously documented Vercel adapter symlink failure during final packaging.
## 2026-08-08, Stripe sandbox funnel verification

Added a separate Stripe Test Mode signing secret and a Production Meta test event code in Vercel, then redeployed the site. Created a Stripe sandbox Payment Link for the $79 AI Bottleneck Snapshot and configured its completion redirect to the paid intake. The first webhook delivery returned HTTP 308 because Stripe was pointed at the slashless API route; updating the destination to `https://jackmaguire.org/api/stripe-ai-audit/` and resending produced HTTP 200. Meta Test Events received the resulting server-side `Purchase`, value 79 USD, content ID `ai_bottleneck_snapshot`, event ID based on the test Checkout Session. The webhook returns success only when both Meta CAPI and GA4 Measurement Protocol delivery resolve, so the successful response also verifies GA4 acceptance at the server boundary.

The paid test session was then taken through the entire four-step intake using dummy data marked for sandbox QA. The live form submission completed and displayed the Snapshot confirmation page. Meta Test Events showed `AuditIntakeCompleted` as a processed browser custom event with an event ID tied to the Stripe test Checkout Session. The submission was explicitly labeled so it should not produce a real customer deliverable.
