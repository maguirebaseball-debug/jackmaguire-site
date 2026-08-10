# AI Audit launch-price frontier

Date: 2026-08-10

## Decision

Use $59 as the launch price for the AI Bottleneck Snapshot.

This is an informed starting point, not an empirical optimum. There were no live Stripe purchases when the decision was made. The prior $79, $199, $499, and $999 prices were product decisions, not controlled price tests.

The decision weights paid customer learning and valid Meta Purchase volume more heavily than short-term front-end revenue. Jack reported that each Snapshot takes about 20 minutes to complete, he has capacity, and his immediate goal is to get the first customers so he can improve the offer.

## Model

The base scenario uses a semilog demand curve:

`E(p) = E79 * exp[-0.01 * (p - 79)]`

`E79` is the number of purchases a $79 offer would produce for the same $10,000 of spend. The absolute number is unknown. Relative results do not depend on the assumed starting CPA.

| Price | Purchase events vs $79 | Front-end revenue vs $79 |
| ---: | ---: | ---: |
| $39 | +49.2% | -26.4% |
| $49 | +35.0% | -16.3% |
| $59 | +22.1% | -8.8% |
| $69 | +10.5% | -3.5% |
| $79 | baseline | baseline |
| $89 | -9.5% | +1.9% |
| $99 | -18.1% | +2.6% |

In this scenario, $59 is the practical knee. Dropping to $49 buys more events, but each added event costs more expected revenue and may select for buyers who are less representative of a later $79 offer. Moving to $69 or $79 preserves revenue but works against the immediate need for first customers.

At 20 minutes of fulfillment, $59 equals $177 of gross fulfillment revenue per hour before acquisition costs, refunds, payment fees, and other work.

## What would change the decision

Track these separately:

1. Paid Stripe purchases per $10,000 of spend
2. Collected revenue after refunds per $10,000 of spend
3. Intake completion rate
4. Seven-day retained purchase rate
5. Median fulfillment time and on-time delivery rate
6. Useful customer feedback and permission to use outcomes as proof

Keep $59 until there are at least 20 to 30 paid buyers outside Jack's personal network or enough traffic to show that the offer itself is not converting. Then test $69 against $59. Raise toward $79 only if the higher price preserves enough purchase volume or the lower price attracts buyers who do not complete intake or use the recommendation.

## Measurement notes

The Meta Purchase event is a strong signal because it is sent only after a signed, paid Stripe Checkout Session passes amount, currency, live-mode, and offer checks. The new $59 event should send an actual value of 59 USD. The old $79 amount remains temporarily accepted by the webhook during cutover so cached checkout pages cannot lose attribution.

Meta describes Conversions API as a direct connection to its optimization systems and recommends reliable event matching, sufficient budget, at least seven days of delivery, and simple account structure. Meta's current public pages used for this decision do not present 50 weekly events as a universal hard requirement.

- [Meta Conversions API](https://www.facebook.com/business/help/AboutConversionsAPI)
- [Meta performance marketing guidance](https://www.facebook.com/business/ads/performance-marketing)
- [Meta budget guidance](https://www.facebook.com/business/ads/pricing)

## Operational follow-up

The dynamic Checkout endpoint still requires a least-privilege `STRIPE_AI_AUDIT_RESTRICTED_KEY` in Vercel. Until it is configured, the landing page uses the hosted $59 Payment Link. The Payment Link preserves the buyer, `_fbp`, `_fbc`, and GA client reference in compact form, while dynamic Checkout can also preserve campaign, ad name, placement, and landing-session metadata.
