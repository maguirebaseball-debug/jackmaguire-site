# jackmaguire-site

Personal website and blog for Jack Maguire. Built with Astro, hosted on Vercel, source on GitHub.

## Stack
- **Framework**: Astro (static site generator)
- **Hosting**: Vercel — auto-deploys on every push to `main`
- **Repo**: https://github.com/maguirebaseball-debug/jackmaguire-site
- **Live site**: https://www.jackmaguire.org

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
git add -A && git commit -m "description" && git push
```
Vercel redeploys automatically. Live in ~60 seconds.

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

## About the site owner
Jack Maguire — Senior Paid Social Media Director at National Debt Relief. East Village, NYC.
Topics: performance marketing, NYC food, travel, philosophy, AI tools.
Contact: maguirebaseball@gmail.com
