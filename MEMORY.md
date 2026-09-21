# Memory

## 2026-09-20, Octopus baking and roasting temperature culinary study with data visualizations

Published the empirical culinary study [Baking Octopus: What 250 Culinary Sources Say About Internal Pull Temperature, Oven Heat, Pre-Salting, and Slime Removal](https://jackmaguire.org/blog/octopus-baking-temperature-culinary-study/) in `src/content/blog/octopus-baking-temperature-culinary-study.md`. Added six 300 DPI high-resolution data visualization charts in `public/images/octopus/`: internal pull temperature histogram, oven temperature histogram, pre-salting method distribution, pre-salting duration distribution, post-salt wash action distribution, and the 5-panel master executive dashboard. Built from a 250-observation empirical dataset across five dimensions (50 sources each) excluding government and food safety boilerplate. Local Astro build passed cleanly with zero errors.

## 2026-09-20, Delete seven Central Europe 2026 travel articles

Deleted all seven Central Europe travel articles (`venice-mestre-to-ljubljana-bus.md`, `ljubljana-to-graz-train.md`, `graz-to-bratislava-bus.md`, `bratislava-to-brno-bus.md`, `geneva-airport-layover-walk.md`, `wroclaw-to-dublin-flight-schiphol-layover.md`, and `dublin-authentic-pubs-mulligans-gravediggers.md`) and the entire `public/images/europe-2026/` image folder from the site per user request for further work. Local Astro build verified with clean generation.

## 2026-09-20, Appalachian Trail thru-hike long-form guide with data visuals

Published the long-form guide [Walking 2,178 Miles in 98 Days: My Appalachian Trail Log, Ultralight Gear, and Field Notes](https://jackmaguire.org/blog/appalachian-trail-thru-hike-98-days/) in `src/content/blog/appalachian-trail-thru-hike-98-days.md`. Created four standalone responsive SVG charts in `public/images/at/`: daily mileage progression, cumulative pace trajectory against a standard 150-day thru-hike, state-by-state pace comparisons, and itemized 5.73 lb gear weight breakdown. Extracted the full 98-day log into `research/at-98-days.json` from the Notion archive. Formatted to accurately reflect hiking with a partner while keeping individual gear and data focus on Jack, with zero mentions of names or family, zero em or en dashes, and direct practical takeaways. Built and deployed via commits `7037685`, `3237760`, and `e857f4f`, and live-verified on Vercel.

## 2026-09-20, Remove dating quiz from header

Removed the Dating quiz link from `src/components/Header.astro` so it no longer appears in the site navigation across the homepage and other pages. The standalone route `/compatibility-quiz/` remains intact.

## 2026-09-03, Compatibility quiz preference and practical-fit revision

Revised `src/pages/compatibility-quiz.astro` to keep 16 ranked relationship-style questions while restoring quiet-life and family signals, replacing the disputed interest swap with warmth and specific care, and rewriting curiosity and accountability around remembered details, boundaries, context, and repair. Moved height out of the score into a direct 5'3" practical-fit check, added a long-term-intent check, removed the duplicate hidden contact form, and changed results to show relationship-style alignment, core flags, and practical fit separately. One weak core answer now prompts investigation; two or more produce a cautious mismatch result. Direct Astro compilation and prerendering passed, `git diff --check` passed, and final Vercel packaging still stops on the known Windows Sharp symlink permission error.

## 2026-09-02, Compatibility quiz interests revision

Removed the low-discrimination Quiet and Family questions from `src/pages/compatibility-quiz.astro`, reducing the quiz to 15 questions. Added an Interests question with appealing options that distinguish intellectual and psychological depth from familiar comfort entertainment. Updated weights, preference alignment, core-floor membership, hero copy, and the emailed core-question explanation.

Append dated summaries of meaningful site changes, deployments, indexing work, and durable content decisions. Link to changed files and live validation. Do not paste build logs.

## 2026-08-20, Compatibility quiz preference redesign

Rewrote all 16 questions in `src/pages/compatibility-quiz.astro` as forced-choice tradeoffs among healthy relationship preferences. Each question has one Jack-specific answer worth 4 points and three reasonable alternatives worth 2, except the height dealbreaker, which remains 0 for practical incompatibility. Preferred answer positions are balanced four each across A, B, C, and D. Updated thresholds and report language so the score describes fit with Jack rather than relationship quality. The four Notion AI Slop gates passed, the route prerendered, commit `86e371b` deployed, and production served the new intro and quiz bundle.

## 2026-08-20, Compatibility quiz mobile fix

Fixed the dynamically generated quiz answer and report styles in `src/pages/compatibility-quiz.astro`. The live mobile-facing cards now render as separate flex targets with borders and spacing rather than run-on inline text. Verified the deployed route, all 64 radio inputs, 16 selected answers, successful report generation, and wiki visibility. The local Astro route still prerenders before the known Windows Vercel Sharp symlink packaging error.

## 2026-08-20, Compatibility quiz

Added `/compatibility-quiz/` in `src/pages/compatibility-quiz.astro` and linked it as `Dating quiz` in `src/components/Header.astro`. The page contains 16 mixed, behavior-based questions, a browser-only scored report, a neutral under-5'5" dating question with no height requirement, and the supplied full matchmaker wiki. The route prerendered successfully in the Astro build; final local Vercel packaging remains blocked by the known Windows Sharp symlink limitation.

## 2026-08-12, How ChatGPT sees New York City interactive map

Built `/blog/how-chatgpt-sees-new-york-city/` as a custom map-first interactive article. The city geometry comes from all 262 official 2020 Neighborhood Tabulation Area polygons and is grouped into 25 non-overlapping, exhaustive visual clusters. Generated one independent amateur-photo-style ChatGPT portrait for each cluster, compressed the final assets to local 720 pixel WebP files, and added hover, click, tap, select, and keyboard interactions. The article explains the shared prompt, synthetic people, possible model stereotypes, disputed neighborhood boundaries, editorial clustering, and the NYC Planning source. Desktop and mobile browser checks confirmed 25 unique clusters, successful image switching, keyboard activation, and no horizontal overflow. Astro prerendered the route and placed it first in the homepage, Writing archive, and RSS feed. Final local Vercel packaging remains blocked by the known Windows Sharp symlink limitation.

## 2026-08-11, AI Audit wasted-time hero

Replaced the AI Audit hero's abstract recurring-cost metaphor with the stronger cold-traffic pain: losing time to a repetitive task while suspecting AI could make it faster. The new support copy says the plan identifies where AI can help, what should stay manual, and one workflow to test, avoiding an implication that every task should be fully automated. The closing CTA now says the buyer already knows which task should take less time and Jack will show them what to test. Commit `07761c3` deployed successfully. Production returned the new hero, support copy, final CTA, and unchanged checkout measurement code.

## 2026-08-11, AI Audit experience proof and LinkedIn verification

Added a direct answer to the DIY objection on `/Your-AI-Audit/`. The page now connects more than 300 million agentic AI tokens of hands-on work across job applications, tailored outreach, websites, event planning, business plans, and custom business agents to the buyer benefit: skipping tool research and trial and error to receive one practical answer. Kept the metric out of the hero and proof tiles so it supports the offer without competing with it. Added a same-tab `Jack on LinkedIn` footer link with `rel="me"`. Commit `1d1c3f1` deployed successfully, production returned the new proof and link, and the checkout measurement script remained identical to the prior deployment.

## 2026-08-11, AI Audit ad-to-page copy continuity and question form

Revised the `/Your-AI-Audit/` hero and closing offer so cold traffic sees the same sequence promised in the repetitive-task ad: the recurring weekly cost, a 45-minute task threshold, the exact one-page deliverable, $59 price, next-business-day delivery after the completed intake, and the automatic refund condition. Added a low-emphasis Web3Forms question form below the final checkout block for task-fit questions. The form asks only for name, email, and a question, warns visitors not to share private data, and states that it does not add them to a newsletter. Astro prerendered the route successfully before the documented Windows Sharp symlink failure during final Vercel function packaging. Commit `e1d7d75` was pushed to `main`, and production returned the new hero, checkout path, form action, privacy note, and success copy.

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

Added `src/pages/tylercowen-retro.astro`, a standalone visual report at `/tylercowen-retro/`. It translates the 2019-2025 retrospective audit into a responsive editorial page with a seven-year ledger, three outcome cards, three ranked dimension-effect charts, an outlier scatter plot, a codebook, method notes, and official retrospective links. Added a bespoke social preview at `public/tylercowen-retro-og.png`. Local build, indexing check, and browser visual review passed before deployment.

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

## 2026-08-08, Transparent AI Audit process previews

The AI Audit browser GA4 helpers were first changed to self-initialize `window.dataLayer` and `window.gtag`, but the connected Chrome DebugView session still showed zero debug devices and zero events. The funnel was then moved to the server-backed GA4 endpoint described below.

## 2026-08-08, GA4 AI Audit server event repair

Added `/api/ga4-audit-event/`, an allowlisted Vercel endpoint that sends AI Audit funnel events to GA4 Measurement Protocol using the configured `GA4_API_SECRET`. The landing-page CTA now waits for all three checkout events before navigating to Stripe. A live `ga_debug=1` test showed `ai_audit_cta_clicked`, `begin_checkout`, and `ai_audit_checkout_started` in GA4 DebugView. The endpoint preserves the GA4 client and session identifiers and keeps debug mode limited to the explicit test query.

## 2026-08-08, Edgewell application thank-you campaign

Created the Edgewell Thank You tab in the existing Google Sheets YAMM workbook 222 outreach. Added 88 personalized, long-form thank-you notes from the supplied verified Apollo export, with role-specific emphasis on paid social, measurement, finance, systems, operations, commercial leadership, or people and talent work. All rows are marked SEND; no messages were sent.

Added a no-surprises process section to `/Your-AI-Audit/` immediately before the recommended Snapshot offer. It links from the hero and shows three browser-style previews of the Stripe checkout, the real eight-question intake structure, and an illustrative one-page Snapshot. The copy clearly labels the report example as illustrative and states what the buyer does not need to provide. Live deployment verified the new section and hero link.

## 2026-08-10, NomadMania travel list normalization

Rebuilt `/Travellist/` from the live NomadMania profile endpoint, which currently reports 137 visited region IDs. Normalized single-city regions to city names and kept multi-city entries at their regional level. Omitted Brussels at Jack's request while retaining Flanders, producing 136 displayed rows. Removed the prior NomadMania embed and kept the page searchable, filterable, and linked to Wikipedia.

## 2026-08-10, Travel Wikipedia link audit

Audited the 141 unique Wikipedia targets rendered by `/Travellist/` against Wikipedia's API. Replaced generic or semantically wrong targets with verified containing regions, states, or countries, including parent links for composite NomadMania regions and U.S. subregions. The rendered page still contains 136 rows and no missing Wikipedia targets.

Removed New Brunswick from `/Travellist/` at Jack's request. The page now displays 135 entries.

## 2026-08-10, Travel continental map sections

Added locally saved map captures from NomadMania's Regions page at `public/images/travel/regions/`. The travel list now groups its 135 rows into Europe, North America, South America, and Asia, with a responsive, attributed map above each group. Search and country filtering hide empty continental sections as results change.

## 2026-08-10, Canonical visited list memory

Treat `/Travellist/` and `src/pages/Travellist.astro` as the canonical record of Jack's visited places for future Codex work on this machine and repository. The authoritative list is 135 normalized NomadMania regions from the 137-region profile source: Brussels and New Brunswick are explicitly excluded. Preserve the user's regional rule: single-city NomadMania regions may retain the city name, while multi-city or broader entries stay at the relevant regional, state, or province level. Do not infer or add unmentioned cities. Country and region links should use verified English Wikipedia articles, falling back to the nearest verified containing parent when a NomadMania label is informal or lacks its own article.

## 2026-08-10, AI Audit paid-traffic page and measurement cleanup

Shortened `/Your-AI-Audit/` to a single-offer paid-traffic page for the $79 AI Bottleneck Snapshot. The route now contains the existing savings hero, two purchase CTAs, one readable illustrative Snapshot, a short Jack credibility block, the automatic-refund guarantee, and four FAQs. Removed the three-tier ladder and long explanatory sections.

In GA4 Admin, removed generic `click` and `scroll` from key events while preserving `purchase`. Confirmed the existing Internal Traffic filter is Active and excludes `traffic_type=internal`. Added a persistent `ga_internal=1` browser marker, with `ga_internal=0` as the reset, and marked debug and Stripe test events as internal.

Added `/api/stripe-ai-audit-checkout/` to create hosted Stripe Checkout Sessions from the existing $79 Price and persist campaign, ad name, placement, landing-session ID, Meta click identifiers, and GA client ID in Session and PaymentIntent metadata. The Stripe purchase webhook now reads and forwards the attribution fields. Vercel still needs a least-privilege `STRIPE_AI_AUDIT_RESTRICTED_KEY`; until it is configured, the page deliberately falls back to the existing Payment Link.

## 2026-08-10, AI Audit $59 launch price

Repriced the AI Bottleneck Snapshot from $79 to $59 after confirming that Stripe had zero completed live Checkout Sessions. The price is an informed launch prior, not an observed optimum. A simple semilog demand model places $59 at the signal-weighted knee: roughly 22 percent more expected paid Purchase events with roughly 9 percent less expected front-end revenue than $79 for the same ad spend. Jack's current priority is learning from first customers, each audit takes about 20 minutes, and fulfillment capacity is not constrained.

Created a new live Stripe $59 Price and Payment Link, made the new Price the product default, updated all visible, schema, checkout, intake, GA4, and Meta values, and replaced the stale three-tier social image. After the new deployment passed live checks, deactivated the former $79 Payment Link. The Stripe webhook now emits the actual paid Session amount and temporarily accepts both 5900 and 7900 for Snapshot purchases during cutover. The pricing rationale and precommitted test rules are recorded in `research/ai-audit-pricing-frontier-2026-08-10.md`.

## 2026-08-10, AI Audit broad audience and Meta creative

Broadened `/Your-AI-Audit/` from owner-led service businesses to anyone with a repetitive weekly task. The landing page now matches the ad promise: one AI recommendation in one business day, projected to save 30+ minutes a week, or $59 back. Added text-heavy examples spanning inbox replies, meeting notes, spreadsheet updates, scheduling, research roundups, and personal admin. Replaced the business-only illustrative Snapshot with a Sunday inbox and calendar reset, and broadened the paid intake's context question, task list, and constraints.

Created three high-contrast, text-led Meta static ad concepts, each in 1080 by 1080 and 1080 by 1920. The vertical files keep readable elements outside the 10 percent side margins and bottom 20 percent placement-control zone. Assets live under `public/meta-ads/ai-audit/`, with prompts and specifications in `research/ai-audit-meta-ads-2026-08-10.md`.

## 2026-08-10, Five-round AI plan funnel revision

Ran five sequential expert rounds across startup offer design, paid social and CRO, Stripe, measurement, trust, and fulfillment. The page was not clear enough before the revision because it mixed broad audit, fix, Snapshot, and report language while selling advice for one task. The public offer is now the $59 `One-Task AI Plan`: one recurring computer task, one personally selected recommendation, one-page PDF, three setup steps, savings and software-cost math, and one first test. Jack personally reviews it and sends it by the end of the next business day after the completed intake. Installation, account access, custom software, and achieved-results guarantees are excluded. The 30-minute guarantee now covers the credibility of the projected opportunity. Jack initiates a full refund without the buyer asking when the intake cannot support that opportunity.

Rebuilt the landing page around the exact deliverable, a three-step process, a faithful sample, a direct ChatGPT comparison, task fit boundaries, corrected credibility copy, and six closed FAQs. Rebuilt the paid intake around server-side Checkout verification with verified, rejected, and pending-manual states. The public GA4 endpoint no longer accepts Purchase. Browser product and checkout events use canonical item ID `ai_bottleneck_snapshot`, while signed Stripe events own Purchase and successful mapped refunds. The Stripe Product display name is `One-Task AI Plan`; its existing Product, $59 Price, and Payment Link IDs remain unchanged. The live webhook now subscribes to Checkout completion and refund lifecycle events.

Created revised Meta assets at `public/meta-ads/ai-audit/` for task ledger, weekly question, and one-page plan concepts in exact square and vertical dimensions. Their final copy, primary text, UTMs, five-round decisions, and first-cohort stop rules are recorded in `research/ai-audit-meta-ads-2026-08-10.md` and `research/ai-audit-five-round-funnel-review-2026-08-10.md`. Do not spend $10,000 as the first validation test. Use a hard loss cap of no more than $590, likely less while Jack is unemployed, and pause at 100 qualified landing visits with no purchase.

## 2026-08-10, AI plan horizontal Meta assets

Added true landscape versions of all three Meta ad concepts under `public/meta-ads/ai-audit/`. The task ledger, weekly question, and one-page plan files are exact 1920 by 1080 PNGs. Each keeps the same offer, refund condition, palette, and concept identity as its square and vertical counterparts. Commit `1f47aad` deployed the three assets and all public image URLs returned 200.

The remaining operational blocker is `STRIPE_AI_AUDIT_RESTRICTED_KEY`. Without explicit authorization to create and configure this least-privilege live key, Checkout uses the current Payment Link fallback and intake submissions are labeled pending manual verification. Do not describe them as automatically verified. Exact concurrent intake idempotency also requires durable storage; the first-cohort implementation only suppresses sequential repeats through Stripe metadata when the key is available.

## 2026-08-11, AI Audit editorial visual revision

Reworked `src/pages/Your-AI-Audit.astro` around the requested tactile audit-room direction. Preserved the $59 offer, checkout, analytics, guarantee, FAQ, and intake behavior. Added case-file notation, a quieter oversized hero, document fragments, black rules, cobalt decision/action emphasis, restrained acid-lime proof marks, and a more physical one-page-plan artifact. Full Astro build was unavailable because dependencies are not installed in the local workspace; the Impeccable detector and `git diff --check` were run.

## 2026-08-11, AI Audit lavender guided-space revision

Revised the same route again at Jack's direction toward the supplied calm lavender reference. Preserved all offer and funnel behavior while replacing the audit-room treatment with soft lavender surfaces, serif headlines, rounded white panels, periwinkle emphasis, quiet shadows, centered section compositions, and mobile-friendly stacked cards. Removed the old grid and thick side-rule treatment from the active visual system.

## 2026-08-10, AI Audit live campaign and measurement QA

Audited the three identical Meta export files, the live Ads Manager setup, the current landing page, Stripe Checkout handoff, Meta Events Manager Test Events, and GA4 Realtime/Admin using logged-in Chrome. The campaign is correctly paused and contains one broad ad set plus the three named ads. Each ad has three selected media variants for square, horizontal, and vertical use. Ads 1 and 3 use Learn More while ad 2 uses Get Offer.

The live labeled journey produced Meta PageView and InitiateCheckout with value 59, USD, and `ai_bottleneck_snapshot`. Meta ViewContent did not appear. GA4 received view-item and checkout events and has only purchase marked as a key event. The CTA routed to the live $59 fallback Payment Link, which confirmed that dynamic Checkout is still unavailable and dropped campaign ID, ad set ID, ad ID, and site-source fields while preserving source, medium, campaign, content, placement, Meta identifiers, and the GA client reference. No payment was submitted during that initial pass. Keep the campaign paused until the launch gates in `.gstack/qa-reports/qa-report-ai-audit-measurement-2026-08-10.md` pass.

Follow-up sandbox testing created the $59 `One-Task AI Plan Test` Payment Link and completed a no-charge purchase with Stripe's 4242 test card. PaymentIntent `pi_3U35JoFVkBlWBiJ61wZUxSBt`, Checkout Session `cs_test_a1PzoXfr77DAA8CE7wP4y5eNEXMvDX5IQcjeMfp2E7k3eoQENJVXy5CRrl`, and event `evt_1U35JrFVkBlWBiJ6krYcXwxY` were created. The signed webhook returned HTTP 200 with snapshot resolution and successful Meta plus GA4 delivery. The Meta Test Events interface was waiting for `TEST57694`, not the deployed saved test code. GA4 DebugView excluded the test because the payload is marked internal and the Internal Traffic filter is actively excluding internal traffic. Do not treat empty testing views as a delivery failure; align those test controls explicitly before resending if visual confirmation is required.

Temporarily aligned the production Meta test event code with `TEST57694` and resent the signed $59 Stripe event. Meta Events Manager visibly confirmed a processed server-side Purchase with value 59 USD, content ID `ai_bottleneck_snapshot`, and event ID `stripe_cs_test_a1PzoXfr77DAA8CE7wP4y5eNEXMvDX5IQcjeMfp2E7k3eoQENJVXy5CRrl`. Restored the original Vercel test code `TEST97456` and confirmed the restored production deployment was Ready. GA4's Internal Traffic filter was temporarily made inactive for the resend and then restored to Active Exclude. The historical transaction did not appear in DebugView, likely because GA4 had already seen the same Checkout Session transaction ID. Use a fresh sandbox Checkout Session for the remaining visible GA4 Purchase check.

## 2026-08-11, AI Audit GA4 session attribution repair

Same-day launch reporting exposed a measurement defect: Measurement Protocol CTA and checkout events used a synthetic timestamp session ID instead of the visitor's real GA4 session ID, splitting one paid-social visit into Paid Social and Unassigned sessions. Commit `070cf43` now resolves the real GA4 client and session IDs from GS2 or GS1 cookies and `gtag('get')`, adds standard campaign and page context to server events, and waits for both CTA and checkout-start delivery before redirecting to Stripe. A focused identity test covers both cookie formats. The production bootstrap and landing page are live, and an internal QA journey preserved all five UTMs and the compact Meta plus GA client reference. Because the active Internal Traffic filter excludes labeled QA, use subsequent real paid traffic to confirm that new Unassigned duplicates stop growing.

## 2026-08-20, Compatibility quiz mobile design curation

Applied the Impeccable polish workflow to `src/pages/compatibility-quiz.astro` in separate hierarchy, control, report, and wiki passes. Removed decorative eyebrow labels, constrained display type and reading measure, rebuilt answer choices around visible left-side radio affordances and full-label touch targets, improved focus and selected states, simplified the report, and changed the wiki from repeated white cards into an editorial reference layout with one dark final decision block. Preserved every question, option, score, and report threshold. A 390px browser test selected all 16 answers, returned a 63 Mixed fit result, and measured zero clipped answer copy and zero page overflow. The Impeccable detector returned no findings. Astro prerendered `/compatibility-quiz/`; final local Vercel bundling still fails on the known Windows Sharp symlink permission error.

## 2026-08-20, Ox Tavern guide cleanup

Rewrote the Ox Tavern order guide using the Notion AI Slop taxonomy, Humanizer, and Jack's public food-guide examples. Removed slogan-like labels, pseudo-scientific mechanisms, unsupported precision, repeated warnings, the server script, rationale sections, pacing advice, and drink suggestions. The page now contains only the three-dish order for two people, useful modifiers, one dipping note, and the estimated total. Commits `91d90b5` and `b97202f` deployed through GitHub and Vercel; the live route returned 200 with the short order and no explanatory sections. Astro prerendered the route before the known Windows Sharp symlink packaging failure.
## 2026-08-21, Compatibility quiz ranked submission revision

Reworked `src/pages/compatibility-quiz.astro` from single-choice scoring to 16 ranked-choice scenarios. The client shuffles display order, compares each response with an explicit target order using normalized rank distance, weights categories, caps results for weak core-fit dimensions and strong practical incompatibility, validates that each question uses ranks 1 through 4 exactly once, and keeps the full wiki hidden until completion. Submissions use the existing verified Web3Forms key with quiz version, raw ranks, computed scores, timestamp, referrer, and UTM metadata. Updated the privacy policy. Both affected routes prerender; the final Vercel build hook still hits the known Windows Sharp symlink error.
## 2026-08-21, Compatibility quiz browser verification

Removed the stale commented single-choice script left during the ranked-choice revision. A Playwright browser run confirmed 16 questions and 64 selects, the wiki and report start hidden, duplicate or incomplete ranks are rejected, and a valid mocked Web3Forms response reveals the report and wiki with the recorded-status message. The browser emitted no page errors after the clean reload. The full build still reaches both affected routes before the known Windows Sharp symlink packaging failure.

## 2026-09-02, Appalachian Trail source archive in Notion

Searched the local user document folders and Google Drive for the Appalachian Trail journal and related data. No local AT source file was found. The authoritative Google Drive set is the 664-paragraph AT Blog Google Doc, the native atdistancechart sheet with 98 daily rows, the public ATDistanceChart.xlsx workbook, two AT Hiking List gear-sheet copies, and four related slide decks.

Created an Appalachian Trail Thru-Hike Wiki page under the existing Master Wiki in Notion. Added an AT Journal Entries database with all 77 dated source groups as child pages, an AT Distance Log database with all 98 daily rows, overview and stats, stats and graphs, gear and base weight, graphs and data workbook, and source index and press pages. Attached the original ATDistanceChart.xlsx file. The archive preserves the workbook's 2,178.3 cumulative-mile total, 22.48 reported average, and 5.0449 sample standard deviation, and records the 2,178.2 displayed-row sum as a rounding distinction.

## 2026-09-02, Yelp review archive in Notion

Located the complete Yelp export in the Google Doc `Yelp Reviews` and imported all 1,311 reviews into the Notion page `Yelp Restaurant Reviews` under `Master Wiki / Food & Dining Hub`. The archive has 26 chronological child pages, preserves date, restaurant, rating, comment, and Yelp status, and omits the exported IP-address field.

## 2026-09-03, Philadelphia happy-hour research

Created `research/philly-happy-hours-2026.md` after a current web research pass. The source-backed shortlist covers official 2026 happy-hour schedules, drink and food prices, stipulations, addresses, the active Fishtown TAPS program through September 29, Google Maps closure checks, and storefront-photo leads with licensing cautions. The simple site page is now implemented at `/recommendations/philly-happy-hours/` with 34 venue rows, Google Maps links, and five visually inspected official exterior photos. The route generates successfully before the known Windows Vercel Sharp symlink packaging error.

Expanded the Philadelphia happy-hour research into neighborhood sections for Fishtown, University City, and Northern Liberties. Added itemized official deals for Fette Sau, Frankford Hall, Dock Street Fishtown, Picnic, CO-OP, White Dog, Louie Louie, Corio, New Deck Tavern, Urban Village, Yards, and SET NoLibs, plus clearly labeled mixed-source entries for The International, Yanaga, and Jerry's Bar.

## 2026-09-03, Philadelphia happy-hour page

Built `src/pages/recommendations/philly-happy-hours.astro` as a simple neighborhood-organized table with all 34 researched venue rows, deal hours, booze prices, appetizer prices, stipulations, venue links, and Google Maps search links. Added the Fishtown TAPS seasonal note. Checked every venue row in Google Maps on September 3, 2026; each resolved to a matching listing without a permanent or temporary closure notice. Visually inspected candidate exterior photos and used only five official venue-hosted storefront images. Desktop and 390px mobile renders were checked. Commit `4aec999` is pushed to `main`, and the production route is live. Astro route generation succeeds, while the final local Vercel adapter step still hits the known Windows Sharp symlink permission error.

## 2026-09-03, Philadelphia happy-hour mobile tables

Updated the live Philly happy-hour page so mobile widths use stacked, labeled deal rows instead of a horizontally scrolling table. Playwright checks at 390px found body scroll width equal to viewport width, all 12 tables and 34 rows present, hidden table headers, and block-level rows. Desktop checks retained the table header and row layout. Commit `85db404` is pushed to `main` and production was verified after deployment. The local Astro build still reaches the Philly route before the known Windows Vercel Sharp symlink packaging error.

## 2026-09-06, AI Audit ad asset cleanup

Removed all 26 files from `public/meta-ads/ai-audit/`, totaling approximately 59.72 MB. The assets were not referenced by site source pages and were used only as local ad creative files and research-note references. The cleanup is committed as `94c60fb` and pushed to `main`. Astro route generation succeeds after the removal; the final local Vercel packaging step still encounters the known Windows Sharp symlink permission error.

## 2026-09-08, Vercel Web Analytics

Installed `@vercel/analytics` version 2.0.1 and added its Astro `Analytics` component to `src/components/BaseHead.astro`, immediately after the Astro client router. The shared head covers the site layouts and pages already using `BaseHead`. A complete local `npm run build` succeeded, and generated HTML contains the Vercel analytics component and its pageview script.

## 2026-09-08, INTI Kitchen & Bar Minneapolis review

Added `src/content/blog/inti-kitchen-bar-minneapolis-review.md` as a plain Markdown review using all five supplied INTI photos under `public/images/inti-kitchen-minneapolis/`. The article preserves the original 4 out of 5 rating and personal meal observations. Its fact-checks correct the spelling to shoko phing, confirm the $17 eight-piece beef momo order, identify the dish's glass noodles and rice, tingmo, or naan serving options, and confirm the menu names for the cranberry curry puffs, Bhatsa Markhu, gulab jamun, and INTI kheer. Astro built the new route and included it in the homepage, writing archive, and sitemap. The repository indexing script falsely reported missing build output despite those generated files being present and verified.

### 2026-09-20, Central Europe travel article series publication

Published seven high-utility travel guides based on Jack's May 2026 Europe trip across Geneva, Venice, Slovenia, Austria, Slovakia, Czechia, Poland, and Ireland. 

Audited ground-truth transit tickets and wallet passes from the device downloads folder, correcting an earlier assumption about transit from Venice to Slovenia: confirmed as direct FlixBus Route 403, Seat 1A ($46.52, booking 334 913 2154) departing Venice Mestre (Viale Stazione 8/8c) to Ljubljana. Extracted verified ticket data for ÖBB IR 576 Sparschiene (29.90 EUR, Ljubljana to Graz Hbf), FlixBus Route 885 (P&R Webling to Bratislava Nivy), FlixBus Route 260 (Bratislava to Brno Hotel Grand), KLM Cityhopper KL1336/KL1137 (Wrocław to Dublin via Amsterdam), easyJet EJU7457 (Geneva to Venice), and ATVO Venice Airport shuttle.

Pulled 16 original camera photos directly via ADB from the connected Samsung Galaxy S25 Ultra camera roll into `public/images/europe-2026/`. Created the seven plain Markdown articles in `src/content/blog/`:
1. `/blog/venice-mestre-to-ljubljana-bus/`
2. `/blog/ljubljana-to-graz-train/`
3. `/blog/graz-to-bratislava-bus/`
4. `/blog/bratislava-to-brno-bus/`
5. `/blog/geneva-airport-layover-walk/`
6. `/blog/wroclaw-to-dublin-flight-schiphol-layover/`
7. `/blog/dublin-authentic-pubs-mulligans-gravediggers/`

Each article features responsive comparison tables, route timings, and authentic photos. An automated lint script confirmed zero em dashes or en dashes across all files. Local Astro build passed with 0 errors. Commits `05ed30f` and `72a8cdc` were pushed to `main`, and all seven production URLs were verified live with HTTP 200 responses on `jackmaguire.org`.
## 2026-09-20, NYC tsukemen article publication

Published `src/content/blog/best-tsukemen-nyc.md` at `/blog/best-tsukemen-nyc/`. The plain article compares TabeTomo, Okiboru, Taishoken, Yasubee, and GOGYO using a 150-observation qualitative evidence table and links to Jack's own Yelp photo records. Astro build, indexing check, sitemap inclusion, and live HTTP 200 verification passed. Commit `c53ffe5` is pushed to `main`.
