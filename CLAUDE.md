# jackmaguire-site

Personal website and blog for Jack Maguire. Built with Astro, hosted on Vercel, source on GitHub.

## Stack
- **Framework**: Astro (static site generator)
- **Hosting**: Vercel — auto-deploys on every push to `main`
- **Repo**: https://github.com/maguirebaseball-debug/jackmaguire-site
- **Live site**: https://jackmaguire.org (canonical non-www; www redirects to it)

## Key directories
- `src/content/blog/` — blog posts as Markdown files
- `src/pages/` — standalone pages (.astro files)
- `src/components/` — Header, Footer, shared components
- `src/styles/global.css` — global CSS (fonts, colors, base layout)

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

## Writing style
Never use em dashes (—) in any content, copy, or prose written for this site. Use a comma, period, or restructure the sentence instead.

## Design philosophy

This is a personal site. It should look like one.

**Avoid the safe median.** The default AI-generated design palette — muted blue accent, warm off-white background, small-caps labels, hairline dividers, rounded card grid with identical padding everywhere — is recognizable precisely because it is the safest, most neutral option. Any time a layout or typographic choice feels "tastefully editorial," push it further.

**Visual hierarchy must match content importance.** The #1 entry on a ranking page should look structurally different from the #22 entry. Do not make everything visually equal. Break the grid for what matters. If the top result uses the same card size, padding, and font weight as the last result, the design has failed.

**Decoration must earn its place.** An illustration should relate to the actual content, not just gesture at a theme. A skyline silhouette that encodes no information is worse than no skyline. If decoration does not add meaning or delight, remove it.

**Idiosyncratic over polished.** Personal sites accrue personality over time: a first-person aside from Jack, a detail specific to the actual subject matter, something that could not have come from a template. Include at least one element per page that signals a real person built this.

**No bloodless pages.** For food content especially: opinion exists. Prose can be direct and first-person. If every visual decision is neutral and every sentence is in the passive voice, the page is not personal.

## Terminal command formatting
Always give terminal commands as separate lines (one command per line), not chained with `&&`. This lets the user copy-paste each line individually without zsh line-wrap breaking the command.

## npm cache fix
If npm throws cache permission errors, prefix commands with:
```bash
NPM_CONFIG_CACHE=/tmp/npm-jack-cache
```

## Pages to build (not yet done)
- `/recommendations/nyc-restaurants`
- `/recommendations/books`
- `/recommendations/apps`
- `/recommendations/films`
- `/itineraries/central-europe` (15-day trip: Geneva → Venice → Ljubljana → Graz → Bratislava → Brno → Prague → Wrocław → Dublin)
- `/itineraries/nyc-euro` (Greenwich Village + Meatpacking day itinerary)

## Search Console status
- Property: jackmaguire.org (domain-level) — this is the one to manage
- Sitemap submitted: https://jackmaguire.org/sitemap-index.xml — resubmit if it shows "couldn't fetch" (DNS was still propagating at setup)
- TODO: turn off WordPress.com auto-renew (plan paid through Jan 2029, next charge Dec 2028)

## About the site owner
Jack Maguire — Senior Paid Social Media Director at National Debt Relief. East Village, NYC.
Topics: performance marketing, NYC food, travel, philosophy, AI tools.
Contact: maguirebaseball@gmail.com
