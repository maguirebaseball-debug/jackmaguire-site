# jackmaguire-site

Personal website and blog for Jack Maguire. Built with Astro, hosted on Vercel, source on GitHub.

## Stack
* **Framework**: Astro (static site generator)
* **Hosting**: Vercel (auto-deploys on every push to `main`)
* **Repo**: https://github.com/maguirebaseball-debug/jackmaguire-site
* **Live site**: https://jackmaguire.org (canonical non-www; www redirects to it)

## Key directories
* `src/content/blog/` : blog posts as Markdown files
* `src/pages/` : standalone pages (.astro files)
* `src/components/` : Header, Footer, shared components
* `src/styles/global.css` : global CSS (fonts, colors, base layout)

## Content format decision — run this before creating any new page or post

When Jack asks for a new blog post, page, or piece of content, choose the format before writing anything. Ask yourself the three questions below in order and stop at the first match.

**1. Does this post need a custom layout, per-section styling, embedded maps, interactive elements, a two-column design, city cards, a comparison grid, a sticky nav, or any visual structure that differs from a plain text article?**
If yes: use `.astro` — create it as a standalone page in `src/pages/blog/slug.astro`. Import `BaseHead`, `Header`, `Footer`, and `FormattedDate` from components. Full CSS and HTML control. This is the right choice for destination guides, ranked lists with visual hierarchy, anything where the design IS the content.

**2. Does this post need one or two reusable interactive components (a callout box, a cost card, a photo grid, a map embed) dropped inline into otherwise normal prose?**
If yes: use `.mdx` — create it in `src/content/blog/slug.mdx`. Write prose in Markdown, import and drop in Astro components where needed. Frontmatter is identical to `.md`. MDX is already enabled in `astro.config.mjs`.

**3. Is this a straight prose article — structured text, headers, blockquotes, maybe images, no custom layout needed?**
If yes: use `.md` — create it in `src/content/blog/slug.md`. Fastest to write, easiest to edit later. Fine for essays, opinion pieces, research syntheses, and most travel writing.

**Default when unsure**: start with `.md`. If layout ambitions grow during writing, convert to `.mdx` or `.astro`. Never start with `.astro` for a post that is 90% prose.

**Quick reference**:
| Need | Format |
|------|--------|
| Pure prose, no special layout | `.md` |
| Prose + a component or two | `.mdx` |
| Custom layout, grids, cards, per-post design | `.astro` |

---

## Adding a blog post
Create `src/content/blog/slug-here.md` with this frontmatter:
```markdown
---
title: "Post Title"
description: "One sentence summary."
pubDate: YYYY-MM-DD
tags: ["tag1", "tag2"]
---
```
Available tags: nyc, food, books, essays, philosophy, tech, ai, travel

## Deploying
```bash
cd ~/Developer/jackmaguire-site
git add src/pages/path/to/file.astro
git commit -m "description"
git push
```
Vercel redeploys automatically. Live in ~60 seconds.

Claude and Gemini are authorized to run `git add`, `git commit`, and `git push` on this repo without additional confirmation. Deployments to main are expected and approved.

### Before every publish, run in order
1. **Build locally and confirm the specific new page generated.** Run `NPM_CONFIG_CACHE=/tmp/npm-jack-cache npx astro build`, then confirm `dist/<path>/index.html` exists. Do not trust that the Markdown compiles; build it.
2. **Grep the file for em/en dashes** (see Writing style) and confirm zero.
3. **For cited content, confirm every external link resolves and every claim is grounded** (see Fact-checking and verification).
4. **After pushing, spot-check the live page.** Confirm HTTP 200 at the canonical URL, and that the GA4 tag (`G-1697T7D92W`), canonical link, OG/Twitter tags, and the sitemap entry are all present.

## Writing style
* **Harvard Business Review (HBR) Professional Tone**: The writing must be entirely declarative, objective, active, and highly professional. It should read like an authoritative executive summary rather than a dramatic or poetic blog post.
* **Citations and Links**: Whenever providing academic or external citations, you MUST include direct hyperlinks to the source material. Format citations professionally, adhering to a Harvard Business Review (HBR) appropriate style, embedding the link gracefully within the citation. Link every named place, community, or source the first time it appears (for example, link a subreddit to its home URL, `https://www.reddit.com/r/<name>/`).
* **NO Em Dashes or En Dashes**: Absolutely never use em dashes or en dashes anywhere on this domain (including in code, prose, or agent instructions). Use a comma, colon, regular hyphen, or restructure into a new sentence. This applies to post titles and to HN/social submission titles too, even when an inbound brief or outline supplies a title containing a dash: replace it. Before publishing, grep the file for the dash characters to confirm none slipped in.
* **Entity-neutral language for sourced research**: When content draws on aggregated online discussion, describe it in reader-facing, entity-neutral terms ("you will see this across these communities") and link the communities. Do not use words that imply bots or harvesting ("scrape," "scraped," "dataset," "N-thread dataset," "180-day pull"). State the observation, not the collection method.
* **Domain-accurate terminology**: Use the correct native metric for each platform. Reddit threads have "upvotes," not "points" or a "score."
* **NO Cleft Sentences**: Avoid cleft sentences (e.g., "It is X that does Y", "What matters is X"). Write directly ("X does Y", "X matters").
* **NO Parallel Contrast Structures**: Avoid overly dramatized structural cliches like "Not X, but Y," or "One is X. The other is Y." State the fact directly.

## Fact-checking and verification (required for any cited or research-based content)
* **Treat every citation in an inbound brief or outline as an unverified claim, not a fact.** Supplied outlines have contained fabricated sources, misattributions, and distorted numbers. Verify each against a primary source before writing.
* **Verify the owner's own supplied data against the raw source**, not a summary of it. Example: before citing a Reddit thread, confirm its real title, id, and upvote count in the underlying data.
* **When a popular framing diverges from the underlying source, publish the source's version**, and disclose the correction in the piece. Example: label an analyst projection as an estimate, not a company-confirmed figure.
* **Never fabricate quotes.** Only quote text you can locate verbatim in the source. Drop any quote you cannot ground.
* **Link to the real, working primary source.** Never invent or guess a URL.

## Design philosophy & Aesthetics
* **Organic and Earthy, Not AI-SaaS**: Avoid the safe, standard AI-generated look (muted blue accents, perfect symmetry, sterile white backgrounds).
* **Colors**: The primary accent color is Olive Green (#556B2F), with darker moss greens for hover states. No standard web blues.
* **Texture**: Maintain the subtle SVG noise/film-grain overlay on the body to give the screen a physical, paper-like texture.
* **Visual hierarchy must match content importance**: The #1 entry on a ranking page should look structurally different from the #22 entry. Break the grid for what matters.
* **Idiosyncratic over polished**: Personal sites accrue personality over time. Include elements that signal a real person built this. Prose can be direct and first-person.

## Terminal command formatting
Always give terminal commands as separate lines (one command per line), not chained with `&&`. This lets the user copy-paste each line individually without zsh line-wrap breaking the command.

## npm cache fix
If npm throws cache permission errors, prefix commands with:
```bash
NPM_CONFIG_CACHE=/tmp/npm-jack-cache
```

## Pages to build (not yet done)
* `/recommendations/nyc-restaurants`
* `/recommendations/books`
* `/recommendations/apps`
* `/recommendations/films`
* `/itineraries/central-europe` (15-day trip: Geneva, Venice, Ljubljana, Graz, Bratislava, Brno, Prague, Wroclaw, Dublin)
* `/itineraries/nyc-euro` (Greenwich Village + Meatpacking day itinerary)

## Search Console status
* Property: jackmaguire.org (domain-level)
* Sitemap submitted: https://jackmaguire.org/sitemap-index.xml
* TODO: turn off WordPress.com auto-renew (plan paid through Jan 2029, next charge Dec 2028)

## Analytics
* GA4 property: 530019465
* Measurement ID: G-1697T7D92W

## About the site owner
Jack Maguire, Senior Paid Social Media Director at National Debt Relief. East Village, NYC.
Topics: performance marketing, NYC food, travel, philosophy, AI tools.
Contact: maguirebaseball@gmail.com

## Agent Workflows & Text Generation
* **True Blinded Variations**: When the user asks for multiple "blinded" variations of a text, you MUST NOT simulate this in a single response or a single LLM pass. You MUST actually invoke separate sub-agents (using the `invoke_agent` tool or similar delegation mechanisms) to generate each variation entirely independently. This is strictly required to maximize perplexity and capture a full universe of diverse possible answers.
* **Copy-Paste Workflows**: Whenever you generate text that the user is intended to paste somewhere else (like a social media post, external email, or forum submission), you MUST automatically copy it directly to their clipboard using `pbcopy` (e.g., via `run_shell_command` with `echo "text" | pbcopy` or piping a heredoc) AND output the text inside a markdown code block so it avoids terminal visual line-break formatting issues.
