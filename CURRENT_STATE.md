# Current State

Updated: 2026-08-06

The conversion landing page `/Your-AI-Audit/` now uses a paid three-tier offer ladder: a $79 AI Bottleneck Snapshot, a $199 Quick-Win Mini Audit, and a $499 Full AI Audit. The named deliverables are a one-page Snapshot PDF, a three-page Quick-Win Action Memo PDF, and a complete Custom AI Audit PDF with a review call. Each tier states the buyer input, report contents, delivery timing, and whether a call is included. Purchases are required before service, and prior-tier fees apply in full to the next tier for 30 days. Each tier has a scope-matched automatic-refund guarantee: one practical change projected to save 30 minutes per week at $79, recommendations projected to save two hours per week at $199, and recommendations projected to save five hours per week at $499. The guarantee covers the opportunity identified by the assessment, not results dependent on customer implementation. Secure checkout destinations are configured with three public environment variables; until those exist, buttons request the matching secure checkout by email. Checkout clicks send only `InitiateCheckout`, while confirmed purchases must be sent after payment succeeds. The route prerenders successfully. The documented Windows Vercel adapter symlink limitation still affects final local function packaging, so publication uses the normal GitHub to Vercel pipeline.

Sitewide Meta event quality was tightened at the same time. A three-page, two-minute visitor now sends the custom `EngagedVisitor` event instead of `Lead`, and an Instagram clickout sends the custom `InstagramClickout` event instead of `Lead`. Newsletter submissions remain leads, and the existing paid meet match remains a purchase.

The root-level plain article `/bottleneck/` is ready for publication. It presents a purposive, coded corpus of 100 public Substack articles about non-capability AI bottlenecks and is registered with the standalone article feed, so it appears on the homepage and `/blog/`.

The private Amex candidacy page is implemented at `/amex-nyc-hireme/`. It is excluded from sitemap generation, blocked in `robots.txt`, and protected with page-level and Vercel header-level noindex directives. It uses American Express Business-inspired blue, deep blue, neutral color, modular layout, and Benton Sans fallback styling without using official Amex logos or implying endorsement.

The Astro site deploys from GitHub to Vercel on pushes to `main`. Existing agent rules define writing, layout, build, deployment, and live-check requirements. Canonical persistent-state navigation is now present.

Outstanding pages and platform identifiers remain listed in `AGENTS.md`. Update this file when deployment behavior, active migrations, or major blockers change.

The standalone article `causal-inference-with-AI-for-beginners` is ready for publication at its requested root URL. It uses the normal plain article layout and has passed the site build and indexing checks.

The legacy routes `/start/` and `/projects/` return HTTP 301 redirects to `/about/` and `/blog/`, respectively, through Vercel route rules.

The canonical identity page is `/about/`. Site navigation and article bylines use that URL, and Vercel redirects legacy WordPress dated posts, category archives, and the former Appalachian Trail post into their current canonical destinations.

The professional career page is implemented at `/professional-about-me/`. It is based on a review of 47 tailored role records from the ResumeAutomation project and emphasizes the recurring hiring signals across those roles: paid social ownership, measurement, creative testing, budget accountability, profitable acquisition, cross-functional leadership, signal quality, hands-on execution, and practical AI operations. It keeps the normal site header and footer and includes a bespoke social preview.

The page is linked from the global navigation as `Professional Bio`. Its contact address is rendered only as a raster image, with no address in HTML, metadata, links, filenames, or alternative text. The page explicitly permits indexing and rich snippets, appears in the sitemap, and is allowed for major search and AI crawlers in `robots.txt`.

The ProfilePage structured data on `/about/` and `/professional-about-me/` identifies its `mainEntity` as a Person, rather than an untyped ID reference. This addresses the Search Console invalid `mainEntity` object-type report for those two URLs.

The new plain Markdown essay `kind-rejection-approach` is drafted at `src/content/blog/kind-rejection-approach.md`. It uses Notion context about dating, ambiguity, optimization, and digital contact, and links to a supporting research ledger at `research/kind-rejection-approach.md`. Local content checks passed for prohibited dash characters and whitespace. The local environment did not expose Node or npm, so Astro build and indexing checks remain pending.
