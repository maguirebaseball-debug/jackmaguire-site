# Design theme

This file documents the visual system for jackmaguire.org. It pulls together what's implemented in `src/styles/global.css` and the layout rules already specified in `CLAUDE.md`. If the two ever disagree, `CLAUDE.md` wins and this file should be corrected to match.

There are two distinct visual modes on the site: the general site theme (nav pages, listing pages, widgets, custom tools) and the plain article theme (individual blog posts and essays). Do not blend them.

## General site theme

Used for: the homepage, `/blog/` listing, recommendations pages, itineraries, widgets, and any custom `.astro` page that isn't an individual article.

Colors (from `global.css` `:root`):
- Accent: `#556B2F` (olive), hover/dark variant `#3A4B1C`
- Background: `--paper` `#fbfaf6`, warm variant `--paper-warm` `#f5efe3`
- Text: `--gray-dark` `rgb(34, 41, 57)`, headings `--black` `rgb(15, 18, 25)`
- Borders/dividers: `--gray-light` `rgb(229, 233, 240)`

Typography:
- Body: Verdana, Tahoma, Geneva, sans-serif, 17px, line-height 1.68 (16px on screens under 720px)
- Headings: `var(--font-heading)` (Atkinson Hyperlegible, loaded via `@font-face`)
- Links: olive accent, underlined, darker olive on hover

Layout widths:
- `--width-prose`: 980px
- `--width-site`: 1080px (used by `main`)
- `--width-article`: 1440px

Other conventions:
- Tables: full width, bordered top/bottom only (no side borders), zebra striping on even rows
- Blockquotes: 3px solid olive left border
- No border radius anywhere (`border-radius: 0` throughout, including images, code, `pre`)
- `hr` is a plain 1px light-gray top border

Design philosophy: this is a personal site, not a template. Break the grid for things that matter, avoid the safe middle-of-the-road palette, and keep idiosyncratic first-person touches. See `feedback_design_philosophy` in memory for the fuller rationale.

## Plain article theme

Used for: every individual blog post and essay, via `PlainStandaloneBlog.astro` (or the plain layout applied automatically to Markdown posts).

This is a deliberately different, stripped-down theme, separate from the general site look:

- Font: Charter, "Bitstream Charter", "Sitka Text", Cambria, "Times New Roman", Times, serif
- Body text: 16px, line-height 1.35, black (`#000`) on white (`#fff`)
- Desktop width: 80vw
- Mobile: full width, small padding
- Links: browser-default styling (no custom link color/underline treatment)
- Date stays visible
- Tags are not shown

What's hidden on plain article pages: header, footer (except the one link below), reading progress bar, author box, table of contents, related-links block, decorative backgrounds, hero image, custom typography.

What's kept: one minimal footer link, `More writing`, pointing to `/blog/`.

Images: text-only by default. Add an inline image only when explicitly requested or when the post genuinely can't work without one. OG images are metadata only and do not display in the article body by default.

Tables: basic HTML tables are allowed for clarity; do not add custom styling to them on plain pages.

Metadata to preserve even though it isn't visually rendered: title, description, canonical URL, Article schema, RSS inclusion, sitemap inclusion, Open Graph tags, analytics (GA4 `G-1697T7D92W`).

Existing Markdown posts get this layout automatically. `heroImage`, `relatedLinks`, and similar frontmatter fields should stay in the files for reversibility even though the plain layout doesn't display them.

Converting an existing standalone `.astro` page to the plain layout is fine when it's obviously prose-only or a static table. Ask first for anything interactive: widgets, charts, cards, maps, calculators, or custom data UI.

## Choosing the right format before writing

See `CLAUDE.md` "Content format decision" for the full three-question decision tree (`.md` vs `.mdx` vs `.astro`). Default to `.md` when unsure.

## Style bans (apply everywhere, both themes)

- No em dashes or en dashes, anywhere: prose, code, agent instructions. Use a comma, colon, hyphen, or new sentence.
- No AI-tell phrases: "it's not just X, it's Y," "delve," "unlock," "tapestry," "comprehensive," "game-changer."
- No tidy summary phrases: "in the end," "ultimately," "it is important to note."
- Avoid cleft sentences and dramatized parallel contrast ("Not X, but Y").
- Entity-neutral language when describing aggregated online discussion, no bot/harvesting framing.
- Structure over punctuation: when punctuation is doing organizational work, use layout (headings, lists) instead.

## Source of truth

- Implementation: `src/styles/global.css` (general theme), `src/layouts/PlainStandaloneBlog.astro` (plain article theme)
- Rules and rationale: `CLAUDE.md` ("Blog article standard", "Design philosophy and aesthetics" sections)
- This file (`DESIGN.md`) is a summary for quick reference. Update it whenever the underlying CSS or CLAUDE.md rules change.
