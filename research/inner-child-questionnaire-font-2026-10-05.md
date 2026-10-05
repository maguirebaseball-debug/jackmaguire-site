# Font choice for the Adult Relationship Patterns questionnaire

Checked October 5, 2026.

The questionnaire uses Open Sans at 18px with a line height of 1.48. It is served from the site with `@fontsource/open-sans`, so taking the questionnaire does not require a request to Google Fonts. The PDF report uses a standard embedded PDF sans serif font for portable rendering.

The [U.S. Office of Disease Prevention and Health Promotion](https://odphp.health.gov/healthliteracyonline/design-easy-scanning/use-readable-font-thats-least-16-pixels) recommends a familiar sans serif for online health information, at least 16px text, and line spacing around 130% to 150%. It lists Open Sans as a suitable example. The source also says research has not established a universal serif versus sans serif winner, so this is a practical readability choice rather than a claim that one font is always fastest.

The [UK Office for National Statistics design system](https://service-manual.ons.gov.uk/design-system/foundations/typography/) uses Open Sans for text-heavy digital interfaces. ONS cites legibility across display quality and visual ability, and uses 18px paragraphs. This is a particularly relevant precedent for a public questionnaire.

The page keeps the pilot's exact 48 item texts, numeric anchors, N/U/S options, caregiver instructions, fixed item order, and 6-of-8 scoring rule from `Six_Inner_Child_Questionnaire_Pilot.docx`. The interface displays pattern labels only after completion. No input values are sent to a server, and this route omits the site's analytics scripts because the answers are sensitive.
