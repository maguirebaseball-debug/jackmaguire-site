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

## Writing style
* **Harvard Business Review (HBR) Professional Tone**: The writing must be entirely declarative, objective, active, and highly professional. It should read like an authoritative executive summary rather than a dramatic or poetic blog post.
* **Citations and Links**: Whenever providing academic or external citations, you MUST include direct hyperlinks to the source material. Format citations professionally, adhering to a Harvard Business Review (HBR) appropriate style, embedding the link gracefully within the citation.
* **NO Em Dashes or En Dashes**: Absolutely never use em dashes or en dashes anywhere on this domain (including in code, prose, or agent instructions). Use a comma, colon, regular hyphen, or restructure into a new sentence.
* **NO Cleft Sentences**: Avoid cleft sentences (e.g., "It is X that does Y", "What matters is X"). Write directly ("X does Y", "X matters").
* **NO Parallel Contrast Structures**: Avoid overly dramatized structural cliches like "Not X, but Y," or "One is X. The other is Y." State the fact directly.

## Design philosophy & Aesthetics
* **Organic and Earthy, Not AI-SaaS**: Avoid the safe, standard AI-generated look (muted blue accents, perfect symmetry, sterile white backgrounds).
* **Colors**: The primary accent color is Olive Green (#556B2F), with darker moss greens for hover states. No standard web blues.
* **Texture**: Maintain the subtle SVG noise/film-grain overlay on the body to give the screen a physical, paper-like texture.
* **Human Touch**: Include handwritten signatures (using the Caveat font) at the end of posts ("- Jack") to signify human authorship.
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

## About the site owner
Jack Maguire, Senior Paid Social Media Director at National Debt Relief. East Village, NYC.
Topics: performance marketing, NYC food, travel, philosophy, AI tools.
Contact: maguirebaseball@gmail.com

## Agent Workflows & Text Generation
* **True Blinded Variations**: When the user asks for multiple "blinded" variations of a text, you MUST NOT simulate this in a single response or a single LLM pass. You MUST actually invoke separate sub-agents (using the `invoke_agent` tool or similar delegation mechanisms) to generate each variation entirely independently. This is strictly required to maximize perplexity and capture a full universe of diverse possible answers.
* **Copy-Paste Workflows**: Whenever you generate text that the user is intended to paste somewhere else (like a social media post, external email, or forum submission), you MUST automatically copy it directly to their clipboard using `pbcopy` (e.g., via `run_shell_command` with `echo "text" | pbcopy` or piping a heredoc) AND output the text inside a markdown code block so it avoids terminal visual line-break formatting issues.
