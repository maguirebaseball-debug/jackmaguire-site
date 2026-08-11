# AI Audit Meta static ads

Date: 2026-08-10

## Campaign purpose

The first campaign tests three recurring task-family hypotheses while keeping the price, product contract, CTA, landing page, audience, optimization event, and measurement rules stable.

Meta continues to optimize for Purchase. The business decision metric is an eligible paid order: a Purchase followed by completed intake, excluding a no-fit refund.

## Shared offer and CTA

Every asset uses this offer sentence verbatim:

> Get one AI recommendation in one business day, projected to save 30+ minutes a week, or your $59 back.

Every asset uses this CTA:

> Get my one-task plan for $59

The buyer-facing product name is `One-Task AI Plan`. `ai_bottleneck_snapshot` remains the internal analytics and Stripe offer identifier, but it is not the main ad label.

## Deliverables

| Ad | Task-family hypothesis | Square | Vertical |
|---|---|---|---|
| 1 | Communication admin | `public/meta-ads/ai-audit/ad-01-task-ledger-square-1080.png` | `public/meta-ads/ai-audit/ad-01-task-ledger-vertical-1080x1920.png` |
| 2 | Spreadsheet and reporting | `public/meta-ads/ai-audit/ad-02-weekly-question-square-1080.png` | `public/meta-ads/ai-audit/ad-02-weekly-question-vertical-1080x1920.png` |
| 3 | Planning and personal admin | `public/meta-ads/ai-audit/ad-03-practical-fix-square-1080.png` | `public/meta-ads/ai-audit/ad-03-practical-fix-vertical-1080x1920.png` |

Squares are exactly 1080 by 1080 pixels. Vertical assets are exactly 1080 by 1920 pixels. Each vertical file keeps the bottom 384 pixels free of readable elements and keeps readable elements at least 108 pixels from each side.

The square and vertical version of an ad use the same copy hierarchy and task-family hypothesis. The format changes only for placement.

## Exact ad copy and UTM contract

### Ad 1: Communication admin

Headline:

> Still writing the same kinds of emails and follow-ups every week?

Support line:

> Inbox replies. Meeting follow-ups. Routine messages.

Offer:

> Get one AI recommendation in one business day, projected to save 30+ minutes a week, or your $59 back.

CTA:

> Get my one-task plan for $59

Creative name: `ai_audit_communication_admin_v1`

UTM URL:

`https://jackmaguire.org/Your-AI-Audit/?utm_source=meta&utm_medium=paid_social&utm_campaign=ai_audit_launch_59&utm_content=communication_admin&utm_term={{placement}}`

### Ad 2: Spreadsheet and reporting

Headline:

> Still copying the same information into the same report every week?

Support line:

> Export cleanup. Spreadsheet updates. Recurring summaries.

Offer:

> Get one AI recommendation in one business day, projected to save 30+ minutes a week, or your $59 back.

CTA:

> Get my one-task plan for $59

Creative name: `ai_audit_spreadsheet_reporting_v1`

UTM URL:

`https://jackmaguire.org/Your-AI-Audit/?utm_source=meta&utm_medium=paid_social&utm_campaign=ai_audit_launch_59&utm_content=spreadsheet_reporting&utm_term={{placement}}`

### Ad 3: Planning and personal admin

Headline:

> Still rebuilding next week's plan every Sunday?

Support line:

> Calendar cleanup. Reminders. Research and personal admin.

Offer:

> Get one AI recommendation in one business day, projected to save 30+ minutes a week, or your $59 back.

CTA:

> Get my one-task plan for $59

Creative name: `ai_audit_planning_admin_v1`

UTM URL:

`https://jackmaguire.org/Your-AI-Audit/?utm_source=meta&utm_medium=paid_social&utm_campaign=ai_audit_launch_59&utm_content=planning_admin&utm_term={{placement}}`

## Visual contract

- Use high-contrast, text-heavy composition.
- Keep the task-family headline, shared offer, and CTA readable at mobile size.
- Do not use charts, robots, brains, circuits, dashboards, screenshots, or generic AI graphics.
- Use typography, rules, highlights, checkboxes, labels, or a simple task ledger only when they support the text hierarchy.
- Keep the product promise more prominent than decorative elements.
- Use the same underlying layout system across the three ads when practical. If the existing visual styles remain for launch speed, treat performance as directional rather than a controlled task-family test.

## Landing-page and fulfillment alignment

The ads and page must describe the same contract:

- One recurring digital task.
- One human-selected AI tool or workflow.
- Three first setup steps.
- Estimated software cost and projected weekly time saved.
- One-page plan within one business day after completed intake.
- No implementation or account access.
- Full $59 no-fit refund if the report cannot project a 30-minute weekly opportunity.
- Opportunity guarantee, not a results guarantee.

The detailed sample on the page must be no more elaborate than the report Jack can consistently produce in about 20 minutes.

## Measurement contract

- `utm_source=meta`
- `utm_medium=paid_social`
- `utm_campaign=ai_audit_launch_59`
- `utm_content` equals the stable task-family identifier.
- `utm_term={{placement}}`
- Browser Pixel and CAPI Purchase use the same event ID for deduplication.
- Purchase value is 59 and currency is USD.
- BeginCheckout remains a diagnostic event.
- Refund and no-fit status is recorded in the founder learning sheet even if Meta receives no refund event.

## Initial risk cap and review rules

Do not spend $10,000 before purchase proof. The initial paid risk cap is the lesser of $590 or an amount Jack can comfortably lose. Because Jack is unemployed, the practical cap should likely be lower. The cap is a ceiling, not a target.

- At 50 landing page views for one ad with zero checkout starts, revise its hook or page match.
- At five checkout starts and zero purchases, inspect checkout function, trust, and offer clarity.
- At 100 total landing page views and zero purchases, pause paid traffic and revise the funnel.
- After five paid orders, tighten fit copy if two or more become no-fit refunds.
- Do not reprice before five eligible reports are delivered.
- After ten eligible delivered orders, choose a narrower task wedge only if one task family clearly leads on eligible purchases, no-fit rate, and setup attempts.

The full five-round rationale and ship/defer decisions are in `research/ai-audit-five-round-funnel-review-2026-08-10.md`.

## Ad 4: Calm guided plan

Added a fourth visual concept, `aa59_c04_calmnia_plan`, as a theme variant of the one-page-plan concept. It keeps the same $59 offer and report contents while using a pale lavender field, periwinkle accents, high-contrast serif typography, and a rounded white plan card inspired by the current AI Audit landing-page direction.

Assets:

- `public/meta-ads/ai-audit/aa59_c04_calmnia_plan_1x1.png`, 1080 by 1080
- `public/meta-ads/ai-audit/aa59_c04_calmnia_plan_4x5.png`, 1080 by 1350
- `public/meta-ads/ai-audit/aa59_c04_calmnia_plan_9x16.png`, 1080 by 1920
- `public/meta-ads/ai-audit/aa59_c04_calmnia_plan_16x9.png`, 1920 by 1080

The vertical version keeps the lower placement-control area free of important text. This is a visual theme test, not a new offer or task-family hypothesis.
