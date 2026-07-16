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
See the full decision tree in Claude.md / CLAUDE.md (and src/pages/blog/PROCESS.txt for standalone details).

Default for all normal new posts: `src/content/blog/slug-here.md` with the standard frontmatter. Markdown content collection posts render in the plain article layout by default. Use `plain: false` only for the rare post that explicitly needs the older styled layout.

For standalone blog pages, use `src/pages/blog/slug.astro` only when the post needs custom behavior, static tables that are easier in Astro, imported data, or widgets. Prose-only standalone pages should use the same plain shell as normal posts. Interactive pages, calculators, maps, cards, charts, and widget-heavy pages may keep functional UI, but ask before converting existing custom pages.

Links are allowed. Internal and external links should use normal Markdown links in `.md` files and normal `<a href>` links in `.astro` files. Do not force formal citations. Add links only when they help the reader.

Available tags: nyc, food, books, essays, philosophy, tech, ai, travel

## Deploying
```bash
cd ~/Developer/jackmaguire-site
git add src/pages/path/to/file.astro
git commit -m "description"
git push
```
Vercel redeploys automatically after push to `main`. Live in about 60 seconds.

Codex and Gemini are authorized to run `git add`, `git commit`, and `git push` on this repo without additional confirmation. For post changes, the standard workflow is: edit, build locally, run indexing checks when relevant, commit, push to `main`, wait for Vercel, and live-check the affected URL on `jackmaguire.org`.

Do not use direct `npx vercel --prod` as the standard deployment path. Use it only for urgent one-off hotfixes or if git deployment is blocked.

## Blog article standard
All new individual article pages should use the plain style and plain spoken tone by default.

Layout rules:
* Plain article pages use Times New Roman, 16px body text, 1.35 line-height, black text, white background, and 80vw desktop width.
* On mobile, use full width with small padding.
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
* Use plain literal titles by default. The title should say exactly what the post is.
* A short setup is allowed, usually 2 to 5 short paragraphs or lines. Do not write long throat-clearing.
* Use short paragraphs by default, usually 1 to 3 sentences.
* Use simple everyday words. Prefer direct and unshowy phrasing over polished essay language.
* For an essay or research-backed revision, lead with the strongest contrarian opinions the available sources can support. Reduce descriptive scene-setting and let the evidence constrain the claim rather than sanding it into a neutral summary.
* When a user asks for an intentional writing style, use `/styleforge` if it is available. If it is unavailable, say so and choose a stated style from the work's audience, evidence, and purpose.
* First person is allowed only when the claim is true, accurate, and real. Verify first-person experiential claims with Jack before publishing if the agent cannot know them directly.
* Do not include AI/research process disclosure by default. Let the post stand on its own unless the post is explicitly about method.
* Useful links only. Links are allowed, internal and external, but there is no mandatory citation apparatus.
* Same-tab links are the default for internal and external links.
* For best-of posts with 8 or more ranked items or more than about 1,200 words, use headings for each ranked item, e.g. `## 1. Penang, Malaysia`. For shorter ranked lists, a simple numbered line plus short paragraphs is acceptable.
* Short practical takeaways are allowed at the end. End on a concrete recommendation or observation, not a tidy essay conclusion.

Style bans:
* No em dashes or en dashes anywhere on this domain, including code, prose, and agent instructions. Use a comma, colon, regular hyphen, or a new sentence.
* Avoid AI tells and over-polished phrases, including "it's not just X, it's Y," "delve," "unlock," "tapestry," "comprehensive," and "game-changer."
* Avoid tidy summary phrases such as "in the end," "ultimately," and "it is important to note."
* Avoid cleft sentences where a direct sentence works better.
* Avoid dramatized parallel contrast structures like "Not X, but Y" or "One is X. The other is Y."
* In opinion writing, carry the claim through a natural, connected sentence instead of using clipped counter-assertion pairs such as "That is not X. It is Y."
* House style example: "Every advertising platform is designed to make its contribution to revenue visible and persuasive, so its reporting will naturally place the platform near the center of the growth story." See `docs/writing-style-memory.md` for the full decision and before-and-after example.

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

## Token Efficiency & Agent Discipline (Universal - injected from ~/.grok/AGENTS.md + template; customize or remove per-project overrides)
See full details and copy-paste base in ~/.grok/UNIVERSAL_TOKEN_EFFICIENCY_SECTION.md and ~/.grok/AGENTS.md (native). The detailed 7-section version is also in ~/.claude/UNIVERSAL_TOKEN_EFFICIENCY_SECTION.md and ~/.claude/AGENTS.md (loaded via default Claude compatibility). Core: leverage first-turn memory injection + /flush + /dream, externalize to files + targeted tools (read_file limits, grep, selective monitor filters, never full cats or raw long logs), proactive /compact (auto at 85%), subagents only for real independence (cheapest/fast models, spawn_subagent returns ONLY concise high-signal summary + file pointers), skills and personas over re-instruction, run `grok inspect` to verify loaded rules + token counts. Read AGENTS.md + memory context first on startup.
