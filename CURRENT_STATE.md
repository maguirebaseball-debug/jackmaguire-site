# Current State

Updated: 2026-07-28

The Astro site deploys from GitHub to Vercel on pushes to `main`. Existing agent rules define writing, layout, build, deployment, and live-check requirements. Canonical persistent-state navigation is now present.

Outstanding pages and platform identifiers remain listed in `AGENTS.md`. Update this file when deployment behavior, active migrations, or major blockers change.

The standalone article `causal-inference-with-AI-for-beginners` is ready for publication at its requested root URL. It uses the normal plain article layout and has passed the site build and indexing checks.

The legacy routes `/start/` and `/projects/` return HTTP 301 redirects to `/about/` and `/blog/`, respectively, through Vercel route rules.

The professional career page is implemented at `/professional-about-me/`. It is based on a review of 47 tailored role records from the ResumeAutomation project and emphasizes the recurring hiring signals across those roles: paid social ownership, measurement, creative testing, budget accountability, profitable acquisition, cross-functional leadership, signal quality, hands-on execution, and practical AI operations. It keeps the normal site header and footer and includes a bespoke social preview.

The page is linked from the global navigation as `Professional Bio`. Its contact address is rendered only as a raster image, with no address in HTML, metadata, links, filenames, or alternative text. The page explicitly permits indexing and rich snippets, appears in the sitemap, and is allowed for major search and AI crawlers in `robots.txt`.
