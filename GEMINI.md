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

## Adding a new page or blog post
Default for all normal new posts: `src/content/blog/slug-here.md` with standard frontmatter. Markdown content collection posts render in the plain article layout by default. Use `plain: false` only for the rare post that explicitly needs the older styled layout.

Use standalone `.astro` files only when a post needs custom behavior, static tables that are easier in Astro, imported data, or widgets. Prose-only standalone pages should use the same plain shell as normal posts. Interactive pages, calculators, maps, cards, charts, and widget-heavy pages may keep functional UI, but ask before converting existing custom pages.

Links are allowed. Internal and external links should use normal Markdown links in `.md` files and normal `<a href>` links in `.astro` files. Do not force formal citations. Add links only when they help the reader.

## Deploying
```bash
cd ~/Developer/jackmaguire-site
git add src/pages/path/to/file.astro
git commit -m "description"
git push
```
Vercel redeploys automatically after push to `main`. Live in about 60 seconds.

Claude and Gemini are authorized to run `git add`, `git commit`, and `git push` on this repo without additional confirmation. Deployments to main are expected and approved.

For post changes, the standard workflow is: edit, build locally, run indexing checks when relevant, commit, push to `main`, wait for Vercel, and live-check the affected URL on `jackmaguire.org`. Do not use direct `npx vercel --prod` as the standard deployment path.

## Blog article standard
All new individual article pages should use the plain style and plain spoken tone by default.

Layout rules:
* Plain article pages use a system serif stack (Charter, Bitstream Charter, Sitka Text, Cambria, Times New Roman, Times, serif), 18px body text, 1.6 line-height, black text, white background.
* Desktop: Use 80% width with auto margins (effectively 10% page margins). No max-width.
* Mobile: Use 100% width with 20px horizontal padding.
* Use browser-default link styling for links.
* Keep the visible date.
* Do not show tags on article pages.
* Do not show the normal header, footer, reading progress bar, author box, table of contents, related-links block, decorative backgrounds, hero image, or custom typography on plain article pages.
* Show one minimal footer link at the bottom: `More writing`, linking to `/blog/`.
* Keep SEO/AEO metadata: title, description, canonical URL, Article schema, RSS, sitemap inclusion, Open Graph metadata, and analytics.
* Visible article images are text-only by default. Add images only when explicitly requested or when the post cannot work without them. OG images are allowed as metadata and should not display in the article body by default.
* Basic HTML tables are allowed when they make information clearer. Do not add custom table styling for plain posts.
* Existing Markdown posts should use the plain layout automatically. Keep heroImage, relatedLinks, and other frontmatter metadata in files for reversibility, but do not display those extras in the plain layout.
* Existing standalone Astro pages should be converted only when they are obviously prose-only or static-table pages. Ask before converting interactive, widget-heavy, chart, card, map, calculator, or custom data UI pages.

Authoring rules:
* Markdown is the default format for new posts.
* Use plain literal titles by default.
* A short setup is allowed, usually 2 to 5 short paragraphs or lines.
* Use short paragraphs by default, usually 1 to 3 sentences.
* Use simple everyday words.
* First person is allowed only when the claim is true, accurate, and real. Verify first-person experiential claims with Jack before publishing if the agent cannot know them directly.
* Do not include AI/research process disclosure by default.
* Useful links only. Links are allowed, internal and external, but there is no mandatory citation apparatus.
* Same-tab links are the default for internal and external links.
* For best-of posts with 8 or more ranked items or more than about 1,200 words, use headings for each ranked item, e.g. `## 1. Penang, Malaysia`.
* Short practical takeaways are allowed at the end. End on a concrete recommendation or observation, not a tidy essay conclusion.

Style bans:
* No em dashes or en dashes anywhere on this domain, including code, prose, and agent instructions. Use a comma, colon, regular hyphen, or a new sentence.
* Avoid AI tells and over-polished phrases, including "it's not just X, it's Y," "delve," "unlock," "tapestry," "comprehensive," and "game-changer."
* Avoid tidy summary phrases such as "in the end," "ultimately," and "it is important to note."
* Avoid cleft sentences where a direct sentence works better.
* Avoid dramatized parallel contrast structures like "Not X, but Y" or "One is X. The other is Y."

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
* **Reddit Markdown Guide**: When generating content specifically for Reddit (comments, posts), adhere to these formatting rules:
    * **Italics**: `*text*`
    * **Bold**: `**text**`
    * **Links**: `[Link Text](https://url.com)`
    * **Bullet Lists**: `* item` (must have a space after `*`)
    * **Quotes**: `> quote`
    * **Code Blocks**: Four spaces at the beginning of each line
    * **Strikethrough**: `~~text~~`
    * **Superscript**: `text^superscript`

## Token Efficiency & Agent Discipline (Universal - injected)
See ~/.gemini/GEMINI.md and ~/.gemini/UNIVERSAL_TOKEN_EFFICIENCY.md. Use skills for workflows; read global+project GEMINI first; externalize; cheapest subs; follow exact skill/project formats.

## Skill: localnotion
Use the `localnotion.py` script to perform high-fidelity, SQLite-driven queries against the local Notion database.
- **Search pages**: `python3 /Users/jackmaguire/Developer/jackmaguire-site/scripts/localnotion.py search-pages "Keyword"`
- **Get page**: `python3 /Users/jackmaguire/Developer/jackmaguire-site/scripts/localnotion.py get-page "UUID"`
- **Search text**: `python3 /Users/jackmaguire/Developer/jackmaguire-site/scripts/localnotion.py search-text "Phrase"`
Avoid direct API calls or low-effort web searches for anything documented in Notion.
