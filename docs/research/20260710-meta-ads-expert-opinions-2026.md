# Research: Expert Opinions on Meta Advertising 2025-2026 and the CTC Canon

**Date generated**: 2026-07-10
**Source**: Claude.ai Research feature (browser automation via Claude in Chrome)
**Chat URL**: https://claude.ai/chat/426b8798-0f6f-45d6-8427-eae457f298e0

## Source query (verbatim)

> Expert opinions and commentary on Meta advertising in 2025-2026: Andromeda ad retrieval engine, GEM (Generative Evaluation Model), Advantage+ / ASC campaign strategy, budget liquidity and cost caps, the 'never turn off an ad' principle, CAPI and Event Match Quality, creative volume as the main lever for scaling Meta ads. Looking for named media buying experts, agencies, and Meta's own engineering blog commentary that corroborate or complicate the Common Thread Collective 'CTC Canon' framework (as described by CTC VP of Paid Media Tony Chopp).

---

## Full report

Here's the landscape, organized around what's corroborating vs. complicating the CTC Canon / Tony Chopp framework.

### Andromeda and GEM: the technical foundation

Meta's own engineering blog is unambiguous about what changed. The December 2024 post describes Andromeda as a personalized ads retrieval engine that scales up to a large volume of ad creatives using an efficient hierarchical index. The headline numbers Meta published: a 10,000x increase in the complexity of models used for ads retrieval, the step that narrows a pool of tens of millions of ads down to a few thousand candidates, plus a hierarchical structured neural network that boosts model inference efficiency by 10x through model elasticity. Third-party aggregation of Meta's own reporting puts the performance delta at roughly +6% recall and +8% ad quality, figures that get cited so consistently across the trade press that they've become the standard reference point.

GEM (Generative Ads/Ads Recommendation Model) sits downstream of Andromeda as the ranking layer. Trade coverage describes it as Meta's large-scale generative AI system that acts as the ad platform's central intelligence, identifying patterns across organic interactions and ad sequences, formats, and messaging. It was formally unveiled via a Meta engineering paper in November 2025, with reporting noting it's the largest foundation model ever built for recommendation systems, trained at GPT-4 scale across thousands of GPUs, though it had quietly started shipping on Reels months earlier.

Jon Loomer is the most credible independent named voice translating this for practitioners (not affiliated with any agency, long track record of sober Meta analysis going back a decade). His read directly corroborates the CTC line: he cites Meta's own framing that the rise of AI-enabled advertising tools has shifted the focus from niche targeting to creative diversification as the best lever to find the most relevant audiences, but he also pushes back on hype. His bottom line is that Andromeda "should improve performance overall, but it won't guarantee results," and poor performance is more often a creative/offer problem than an algorithm problem. That's a useful check on any framework (CTC's included) that risks over-attributing outcomes to platform mechanics.

### Where CTC's "creative volume as the primary lever" gets corroborated

This is genuinely the mainstream consensus now, not just a CTC opinion. Andrew Foxwell (Foxwell Founders, roughly 550 agency/brand members managing $500M+/month on Meta, probably the single best-triangulated data source outside Meta itself) has been saying the same thing independently: his 2026 material is built around creative diversification, messaging, and net-new concepts rather than funnel hacks. His Foxwell x Motion 2026 State of Agencies report found AI-generated creative still underdelivers in practice: only 11% of agencies have produced a clear top-performing AI-generated ad winner despite widespread adoption, which complicates any version of the CTC story that leans too hard on "just generate more variants with AI."

Technical explainers converge on the mechanism CTC is responding to: Entity ID clustering. Andromeda groups visually/semantically similar ads into one retrieval "ticket", ten ads with the same product photo and different headlines count as one ad to Andromeda, one retrieval ticket for all ten. This is the structural reason "more of the same ad" stopped working and genuinely distinct concepts started mattering. It's not just CTC's house theory, it's a byproduct of how the retrieval index is built.

### Where it gets complicated

A few real tensions worth flagging:

**Diminishing returns on volume itself.** Multiple technical write-ups note that pushing volume without genuine conceptual diversity now actively backfires. Andromeda's similarity detection can suppress an entire cluster if it judges the "core concept" weak, which is why winning ad variations sometimes suddenly die off: the algorithm judged the entire cluster fatigued or irrelevant rather than any single ad. CTC's Canon addresses this directly (Taylor Holiday's framing that creative strategy is a volume mechanism, not an efficiency mechanism), but a lot of the third-party "just make more ads" advice doesn't carry that nuance and risks diluting signal, especially on the budget-per-creative math a lot of smaller advertisers ignore.

**Signal fragmentation vs. Andromeda's appetite for data.** CTC's own account structure advice (one campaign per objective, consolidate, let CBO/Advantage+ do the work) aligns with what Foxwell and most 2026 practitioner content are converging on, but it's a real behavior change from pre-2024 fragmented campaign structures, and there's legitimate debate (mostly in Foxwell Founders-adjacent commentary) about how far to push consolidation before you lose the ability to diagnose what's actually working.

**"Never turn off an ad" and cost caps.** CTC's Tony Chopp and Andrew Foxwell both land in similar territory here, but from different angles. Foxwell's public position on cost controls is aggressive: he advises clients to spend nearly 100% of budget on cost controls, mostly bid caps, because cost controls let you launch limitless new creative and trust Meta to suppress spend on likely losers. That's structurally the same logic as "don't manually kill ads": let the bidding mechanism do triage instead of a human pulling the trigger early. Where it complicates CTC: not everyone agrees cost caps are the right lever at every budget tier (Cody Plofker at Jones Road Beauty prefers bid caps over cost caps specifically, for tighter control), and there's a broader practitioner debate (see the "when to kill an ad" frameworks circulating in 2026) that the real skill is reading learning-phase signals in layers (CTR/hook rate first, funnel signals second) rather than a blanket "never touch it" rule.

**CAPI/EMQ.** This one is less contested, it's closer to settled infrastructure than debated philosophy. The consensus (Meta's own docs plus every serious agency) is that EMQ scores of 7-8+ meaningfully change what GEM/Lattice can learn from your account, and that pixel-only tracking is now genuinely inadequate given iOS/ITP degradation. CTC's "clean data as compounding moat" framing is uncontroversial among the named experts. Where it gets interesting is Meta's April 2026 one-click CAPI rollout, which somewhat undercuts the "sophistication = competitive moat" argument by making baseline EMQ hygiene nearly free for everyone, including advertisers who previously couldn't justify the technical lift.

### On Tony Chopp and the Canon specifically

Worth knowing that the Canon (launched publicly around June 2026) is explicitly framed by Taylor Holiday as CTC codifying and publishing its entire methodology for outside scrutiny. Chopp's Meta section sits alongside Luke Austin's measurement/incrementality framework (their geo-holdout iROAS benchmarks, e.g. Facebook acquisition at 1.14x median iROAS vs. Google branded search at 0.27x, are a genuinely distinctive, well-corroborated contribution nobody else is publishing at that sample size). That measurement layer is arguably the most differentiated part of CTC's public IP, more than the Meta-specific tactics, which mostly track the same consensus Foxwell, Jon Loomer, and Meta's own engineering blog are independently converging on.

---

## Sources cited in the research session

- Tony Chopp LinkedIn: https://www.linkedin.com/in/tonychopp/
- Common Thread Collective LinkedIn post (Tony Chopp episode): https://www.linkedin.com/posts/common-thread-collective_new-episode-with-tony-chopp-the-topic-the-activity-7449872650002382848-VDff
- Common Thread Collective LinkedIn company page: https://www.linkedin.com/company/common-thread-collective
- Ecommerce Playbook podcast (Apple Podcasts): https://podcasts.apple.com/no/podcast/ecommerce-playbook-numbers-struggles-growth/id1087933109
- Common Thread Collective site: https://commonthreadco.com/
- Tony Chopp LinkedIn post ("We solved 100% of our work challenges"): https://www.linkedin.com/posts/tonychopp_we-solved-100-all-of-our-work-challenges-activity-7222669925755105280-YL3V
- CTC "Meet PAM: The Profit Allocation Model": https://commonthreadco.com/blogs/ecommerce-playbook/profit-allocation-model
- CTC "Introducing Our Newest Podcast: The DTC Hotline": https://commonthreadco.com/blogs/dtc-hotline/introducing-dtc-hotline
- Tony Chopp profile (Mesh): https://me.sh/profile/tony-chopp
- YouTube: "How One Methodology Runs 170+ Brands": https://www.youtube.com/watch?v=UmfikyCo0rQ
- Digiday: "Meta moves into controversial ad space of principal-based trading": https://digiday.com/media-buying/meta-moves-into-controversial-ad-space-principal-based-trading/
- Proton: "How and why to turn off Meta's personalized ads": https://proton.me/blog/turn-off-meta-personalized-ads
- FabFunnel: "Meta Ads Automation: 7 Rules Every Media Buyer": https://fabfunnel.com/meta-ads-automation-7-rules/
- Coinis: "When to Kill a Meta Ad and When to Give It More Time": https://coinis.com/blog/when-to-kill-meta-ads-decision-framework
- AnyTrack: "Meta Ads Automation Rules: 5 That Actually Work": https://anytrack.io/blog/meta-ads-automation-rules-that-actually-work-in-2025
- CTC: "Meta Ad Buying Best Practices": https://commonthreadco.com/blogs/tactics/meta-best-practices
- More About Advertising: "Big beast Meta circles principal media buying": https://www.moreaboutadvertising.com/2025/03/big-beast-meta-circles-principal-media-buying/
- Meta Transparency Center: "Introduction to the Advertising Standards": https://transparency.meta.com/policies/ad-standards/
- Superscale: "How to Automate Meta Ads Media Buying With AI Agents": https://superscale.ai/learn/how-to-automate-meta-ads-ai-agents/

Note: Jon Loomer and Andrew Foxwell commentary were referenced in the report body as named experts found via search, but their specific source URLs were not captured as clickable citation links in the rendered response (the searches that surfaced them appear to have been synthesized into prose rather than kept as standalone link cards). If specific Jon Loomer or Foxwell Founders URLs are needed for citation purposes, a follow-up targeted search against jonloomer.com and Foxwell Founders content is recommended.
