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
If yes: 
- For pure-prose essays or research posts (even with custom header styling, slightly wider column, or idiosyncratic title treatment): prefer writing the body as Markdown. Create the standalone `src/pages/blog/slug.astro` for the shell only (consts + custom styles + chrome), and a sibling `slug.content.md` with the full prose in real Markdown (use `[text](https://url)` for every citation/link). In the .astro use `marked` + `set:html` to inject (see PROCESS.txt for the exact 5-line import+parse pattern). This guarantees hyperlinks and prevents bare URL text.
- For true widgets, rankings, or heavy astro expressions/components inside the flow: use `.astro` — create it as a standalone page in `src/pages/blog/slug.astro`. Import `BaseHead`, `Header`, `Footer`, and `FormattedDate` from components. Full CSS and HTML control. This is the right choice for destination guides, ranked lists with visual hierarchy, anything where the design IS the content or the JS is the content.
- Never paste a long citation list or prose body as raw HTML `<p>`s with bare `https://` urls into a .astro.

**2. Does this post need one or two reusable interactive components (a callout box, a cost card, a photo grid, a map embed) dropped inline into otherwise normal prose?**
If yes: use `.mdx` — create it in `src/content/blog/slug.mdx`. Write prose in Markdown, import and drop in Astro components where needed. Frontmatter is identical to `.md`. MDX is already enabled in `astro.config.mjs`.

**3. Is this a straight prose article — structured text, headers, blockquotes, maybe images, no custom layout needed?**
If yes: use `.md` — create it in `src/content/blog/slug.md`. Fastest to write, easiest to edit later. Fine for essays, opinion pieces, research syntheses, and most travel writing.

**Default when unsure**: start with `.md`. If layout ambitions grow during writing, convert to `.mdx` or the .content.md + thin .astro shell pattern. Never start with a giant raw-HTML body in .astro for a post that is 90% prose + citations.

**Quick reference**:
| Need | Format |
|------|--------|
| Pure prose, no special layout | `.md` |
| Pure prose essay + citations, custom header/width styling wanted | `.astro` shell + sibling `slug.content.md` (Markdown body) + marked injection (see PROCESS.txt) |
| Prose + 1-2 components | `.mdx` |
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
3. **For cited content, confirm every external link resolves and every claim is grounded** (see Fact-checking and verification). Additionally: grep the source (the .md/.content.md or the .astro) for bare `https?://` strings that are not inside `href=` / `src=` attributes or inside Markdown `[text](...)` links; there must be zero in prose. The `npm run check:indexing` script now fails on bare URLs in standalone .astro files. Bare URLs render as unlinked text and violate the "MUST include direct hyperlinks" rule.
4. **After pushing, spot-check the live page.** Confirm HTTP 200 at the canonical URL, and that the GA4 tag (`G-1697T7D92W`), canonical link, OG/Twitter tags, and the sitemap entry are all present.
5. **Humanity check** (essays and research posts only). See step 5 in Credibility and humanity protocol.
6. **Evidence tier audit** (essays and research posts only). See step 6 in Credibility and humanity protocol.
7. **Credibility disclosure check** (any post making claims outside Jack's direct professional domain). See step 7 in Credibility and humanity protocol.

## Writing style
* **Harvard Business Review (HBR) Professional Tone**: For essays, blog posts, and research-backed content, the writing must be entirely declarative, objective, active, and highly professional. It should read like an authoritative executive summary rather than a dramatic or poetic blog post.

* **Recommendation and food guide pages (restaurant lists, place guides)**: Use a different voice. Casual and conversational, but not quirky or cute. Short sentences over long ones when both work. No modifier stacks: one precise word beats two vague ones. Cut adverbs that intensify ("genuinely," "really," "truly," "absolutely") and let the noun or verb carry the weight. Simple punctuation: prefer periods and commas. Avoid semicolons stacked with colons and parenthetical asides. No em dashes or en dashes (same as all pages). No decorative lines, extra spacing, or design flourishes in prose. No parallel contrast structures. No cleft sentences.
* **Citations and Links**: Whenever providing academic or external citations, you MUST include direct hyperlinks to the source material. Format citations professionally, adhering to a Harvard Business Review (HBR) appropriate style, embedding the link gracefully within the citation. Link every named place, community, or source the first time it appears (for example, link a subreddit to its home URL, `https://www.reddit.com/r/<name>/`).
* **NO Em Dashes or En Dashes**: Absolutely never use em dashes or en dashes anywhere on this domain (including in code, prose, or agent instructions). Use a comma, colon, regular hyphen, or restructure into a new sentence. This applies to post titles and to HN/social submission titles too, even when an inbound brief or outline supplies a title containing a dash: replace it. Before publishing, grep the file for the dash characters to confirm none slipped in.
* **Entity-neutral language for sourced research**: When content draws on aggregated online discussion, describe it in reader-facing, entity-neutral terms ("you will see this across these communities") and link the communities. Do not use words that imply bots or harvesting ("scrape," "scraped," "dataset," "N-thread dataset," "180-day pull"). State the observation, not the collection method.
* **Domain-accurate terminology**: Use the correct native metric for each platform. Reddit threads have "upvotes," not "points" or a "score."
* **NO Cleft Sentences**: Avoid cleft sentences (e.g., "It is X that does Y", "What matters is X"). Write directly ("X does Y", "X matters").
* **NO Parallel Contrast Structures**: Avoid overly dramatized structural cliches like "Not X, but Y," or "One is X. The other is Y." State the fact directly.
* **Structure over punctuation**: When punctuation is doing organizational work, replace it with layout. Use a bullet list instead of comma-separated inline items. Use a table or definition list instead of repeating `**Label:** description` lines. Use a subheading or a new paragraph instead of a colon introducing an explanation that spans multiple sentences. Punctuation governs sentence rhythm. Layout governs organization. These are not interchangeable. Colons used rhetorically in prose (e.g. "Not the original wound: the escaping") are intentional and should be kept. Parenthetical citations in academic posts are correct attribution format and should be kept.

## Fact-checking and verification (required for any cited or research-based content)
* **Treat every citation in an inbound brief or outline as an unverified claim, not a fact.** Supplied outlines have contained fabricated sources, misattributions, and distorted numbers. Verify each against a primary source before writing.
* **Verify the owner's own supplied data against the raw source**, not a summary of it. Example: before citing a Reddit thread, confirm its real title, id, and upvote count in the underlying data.
* **When a popular framing diverges from the underlying source, publish the source's version**, and disclose the correction in the piece. Example: label an analyst projection as an estimate, not a company-confirmed figure.
* **Never fabricate quotes.** Only quote text you can locate verbatim in the source. Drop any quote you cannot ground.
* **Link to the real, working primary source.** Never invent or guess a URL.

## Credibility and humanity protocol (required for every essay or research-backed post)

This section exists because the AI Job Grief essay hit HN front page at 190 points and 185 comments, and the loudest sustained criticism was: (1) the writing reads like AI-generated content with nothing specific behind it, (2) Reddit upvotes are not evidence, and (3) a performance marketing director writing about developer psychology has a credibility gap that went unaddressed. These rules are designed to prevent those three failure modes in every future piece.

### Before writing begins: four gates, two require Jack's answer

Do not start drafting until all four gates are cleared. Gates Q1 and Q4 require Jack's explicit response. Gates Q2 and Q3 are agent-resolved, but Jack must confirm or correct before writing begins.

---

**Q1. [ASK JACK — cannot proceed without his answer]**
Ask Jack this question verbatim before doing anything else:

> "Before I write this, I need one thing from you: what is your direct personal connection to this topic? Have you experienced it yourself, observed it closely, or are you working entirely from secondary sources? A sentence or two is enough."

Wait for his response. Do not infer or assume. If he says he has no direct experience, the author's lens statement in the opening paragraph must reflect that accurately. If he has direct experience, his answer becomes the Tier 1 anchor for the piece and must appear in the draft in his words, not paraphrased into generic prose.

---

**Q2. [Agent-resolved — present findings to Jack for confirmation]**
Research and answer this yourself: what is the strongest available evidence for the central claim, and what tier does it fall into?

Tier 1: Jack's direct named personal observation (hardest to dismiss as AI output).
Tier 2: Named, linkable publication, study, or expert with credentials.
Tier 3: Observable qualitative pattern across named communities.
Tier 4: Forum upvote counts or aggregated sentiment.

Present your tier assessment to Jack before drafting. If the strongest evidence is Tier 4, tell him explicitly: "The best evidence I have for this claim is Tier 4 (forum sentiment). That means the article can illustrate the claim but cannot prove it. Do you want to source this up, soften the conclusion, or proceed knowing the limitation?" Do not make that call yourself.

---

**Q3. [Agent-resolved — present findings to Jack for confirmation]**
Research and answer this yourself: what is the most obvious objection a skeptical HN reader would raise in the first 10 comments? Look at how similar articles have been received on HN if relevant data is available.

Present the top one or two objections to Jack before drafting, with a proposed response for each. Ask: "Here is the sharpest objection I expect. Here is how I plan to address it in the article. Does that response hold, or should we adjust the claim?" Do not bury the objection in a footnote or hedge the title to avoid it. The response must appear in the body.

---

**Q4. [ASK JACK — cannot proceed without his answer]**
Ask Jack this question verbatim before drafting:

> "I need at least one specific detail for this piece that only you could supply. It can be a named person you spoke to and what they said, a specific moment you observed with a date or place attached, or a first-person experience that grounds the central argument. What do you have?"

Wait for his response. If he says he has nothing specific, do not invent a substitute and do not proceed as if the gap does not exist. Instead, surface the problem: "Without a Tier 1 anchor, this piece will read as AI-generated regardless of how well it is written. Options: (a) we add a named interview or cited expert as a Tier 2 anchor, (b) we frame the piece explicitly as pattern observation rather than reported fact, or (c) we hold it until you have a specific." Let Jack decide.

### Structural requirements for essays

* **Author's lens in the opening section.** For any essay where Jack is writing about a professional domain he does not work in (engineering, medicine, academia, law), one sentence in the first two paragraphs must establish his actual vantage point. It does not need to be self-deprecating. It needs to be accurate and visible before the first contested claim appears.

* **Forum discussion illustrates; it does not prove.** When drawing on Reddit, HN, or any online community as evidence, the sentence structure must be: "You see this pattern across [linked communities]: [specific example]." The structure must never be: "[X upvotes/comments] demonstrates [conclusion]." Upvote counts are a measure of engagement, not correctness. HN readers will call this out. Do not give them the opening.

* **One Tier 1 or Tier 2 anchor per major section.** If a section contains multiple paragraphs making a unified argument, at least one claim in that section must be grounded at Tier 1 or Tier 2. A section that runs on Tier 3-4 evidence for every sentence will be the section quoted as "AI slop" in the comments.

### Pre-publish credibility checklist (run after the existing steps 1-4)

These extend the "Before every publish" list above. Run them in order after steps 1-4 pass.

**Step 5: Humanity check.**
Read the draft and mark every sentence that could plausibly have been written by an LLM with zero personal knowledge of the topic. For each marked sentence: either delete it, replace it with a sentence tied to a specific source or observation, or confirm it is doing necessary connective work and accept it knowingly. The goal is not zero-LLM prose. The goal is that every central claim is anchored to something a machine could not have invented.

**Step 6: Evidence tier audit.**
For each claim that is doing argumentative work (not scene-setting, not transitions), write the tier next to it in a scratch note. If the majority of load-bearing claims are Tier 3-4, either upgrade the sourcing or downgrade the certainty of the conclusion before publishing.

**Step 7: Credibility disclosure check.**
Does the article make assertions about a professional domain Jack does not work in? If yes: confirm the author's lens statement is present and appears before the first such assertion. If the lens statement is absent, add it. This step takes 30 seconds and prevents the most common credibility attack.

## Design philosophy & Aesthetics
* **Organic and Earthy, Not AI-SaaS**: Avoid the safe, standard AI-generated look (muted blue accents, perfect symmetry, sterile white backgrounds).
* **Colors**: The primary accent color is Olive Green (#556B2F), with darker moss greens for hover states. No standard web blues.
* **Texture**: Maintain the subtle SVG noise/film-grain overlay on the body to give the screen a physical, paper-like texture.
* **Visual hierarchy must match content importance**: The #1 entry on a ranking page should look structurally different from the #22 entry. Break the grid for what matters.
* **Idiosyncratic over polished**: Personal sites accrue personality over time. Include elements that signal a real person built this. Prose can be direct and first-person.

### Typography
The site uses three fonts, one role each. Never add a fourth; never swap to the banned list below.

| Role | Font | CSS variable | Why |
|------|------|-------------|-----|
| Headings (h1-h6) | **Plus Jakarta Sans** 700 | `--font-heading` | Clean grotesque sans. Contemporary professional, zero ornament. |
| Body prose | **Plus Jakarta Sans** 400 | `--font-body` | Same family, lighter weight. Functional and readable. |
| Metadata / accent / tables | **Plus Jakarta Sans** 600 | `--font-ui` | Same family, medium weight for dates, labels, UI. |

Single-family sans stack. No serifs anywhere. Hierarchy through weight only. CSS variables are role-based so a future font swap only touches astro.config.mjs.

**Banned fonts** (rejected at least once -- never revert to these): Inter, Geist, Space Grotesk, Instrument Serif, Roboto, Arial, Outfit, Lora, Fraunces, Playfair Display, EB Garamond, DM Sans, Newsreader, Source Serif 4, Figtree, Libre Baskerville, Merriweather, IBM Plex Sans. All serif fonts are banned: the user found every serif tried too "artistic/hokey." Stick to clean grotesque sans.

When prompting image generators or design tools for typography, specify "Plus Jakarta Sans 700 headings, Plus Jakarta Sans 400 body." Never say "clean serif" or suggest a serif alternative.

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

## Token Efficiency & Agent Discipline (Universal — injected from ~/.claude/AGENTS.md + template; customize or remove per-project overrides)
See full details and copy-paste base in ~/.claude/UNIVERSAL_TOKEN_EFFICIENCY_SECTION.md and ~/.claude/AGENTS.md. Core: memory first + update, externalize to files + targeted tools (never full reads/rely on history), proactive /compact with pre-flush. Subagents vs. Direct API (Qualitative Routing): Spawn subagents *only* for Level 4/5 Cognitive Labor (complex multi-file mutation/debugging, interactive terminal loops, or blinded/adversarial isolation). For Level 1-3 Information Labor (log/CSV parsing, HTML scrapes, transcript indexing, bulk data-density updates), you are **forbidden** from spawning subagents. Instead, write a python script or cURL call targeting the direct Gemini API. A subagent ReAct loop re-submits system prompts and tool schemas on every turn, causing token usage to balloon quadratically. Direct API calls are one-shot, tool-free, and context-efficient. High-yield migration tasks include Hinge screenshot screening, Youtube transcript dossiers, Reddit/Forum sentiment scrapers, Fidelity CSV parsing, and WorldCup monitors. Subagents must always use the cheapest models and return summaries only. Externalize to files in isolated workspace or project dirs; reference summaries. Grounding for research. Strict output formats. See ~/.claude/AGENTS.md for routing + sub cost rules.
