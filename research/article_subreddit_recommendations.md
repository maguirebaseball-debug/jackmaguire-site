# Article and Subreddit Recommendations
*Synthesized from 4-round adversarial debate pipeline. Generated: 2026-05-31.*

---

## Site Context

**Site:** jackmaguire.org. Personal site by Jack Maguire (Senior Paid Social Director, National Debt Relief, East Village NYC). Viral post: "AI Job Grief" (9,759 sessions, 90 days, entirely HN + Reddit referral). Zero Google organic traffic.

**Key distribution finding:** Most obvious subreddit targets ban personal blog posts. r/technology, r/Economics, r/finance, r/financialindependence, r/datascience (weekly threads only), r/MachineLearning (self-promo thread only), r/programming (bans AI content). Verified viable targets: r/slatestarcodex, r/artificial, r/devops, r/cscareerquestions (text posts only).

---

## Recommendation 1: PUBLISH-READY

**Title:** Three AI Coding Agents Deleted Production Databases in 16 Months

**Format:** `.md`

**Core argument:** PocketOS (April 2026, Cursor/Claude, 9 seconds), Replit (July 2025, 1,206 records deleted during explicit code freeze, CEO public acknowledgment), and Amazon Kiro (December 2025, 13-hour AWS Cost Explorer outage) each suffered irreversible production database deletions because every major AI coding tool ships without a write-confirmation gate on destructive operations.

**Primary subreddit:** r/devops, flair: Discussion, best time: Tuesday or Wednesday 8-10am ET
**Backup subreddit:** r/artificial, flair: News
**HN viable:** Yes. HN title: "AI coding agents deleted three production databases in 16 months. Here is the structural cause."

**Submission tactics:**
1. Open the Reddit post body by naming all three incidents with dates and record counts, then invite DevOps practitioners to share what confirmation gates they have deployed in their own pipelines.
2. Frame as operational risk management, not AI criticism. Speak to blast radius and rollback posture. The r/devops audience runs production systems.
3. Do not open with "I wrote a blog post." Paste the core finding directly into the post body, then link the full article at the end.

**Content brief:** Documents PocketOS (April 2026, 9 seconds), Replit (July 2025, 1,206 records deleted during an explicit code freeze), and Amazon Kiro (December 2025) as three expressions of one missing control: no confirmation prompt before destructive database operations. Specifies the three infrastructure controls (write-confirmation gates, credential scoping, separate approval for DROP and DELETE in production) that would have prevented each incident.

**Reddit thread signal:** 104 threads across the AI coding agent incident cluster
**HN viability score:** 90/100 (LLM/Security clusters, named incidents, number hook, declarative 11-word title)

**Verification required before writing:**
- Confirm Amazon Kiro December 2025 incident details from primary source reporting
- Drop the McKinsey 72% figure entirely (it measures GenAI adoption rates, not agent deployment scale)
- Confirm PocketOS post-mortem URL (The Register, April 2026) and Replit CEO acknowledgment (Fortune, July 2025)

---

## Recommendation 2: PUBLISH-READY

**Title:** 5 AI Benchmark Scores in Vendor Pitch Decks That Practitioners Should Scrutinize

**Format:** `.md`

**Core argument:** Published research documents that benchmark contamination inflates scores on standard tests by measurable margins, and vendor pitch decks consistently cite contaminated benchmarks without disclosing which training sets overlapped with the test data.

**Primary subreddit:** r/artificial, flair: Discussion, best time: Tuesday 9-11am ET
**Backup subreddit:** r/cscareerquestions (text post only, not link post; frame as discussion, link article in first comment)
**HN viable:** Yes. HN title: "What benchmark contamination actually means for the numbers in vendor pitch decks"

**Submission tactics:**
1. Open the Reddit post body with the practitioner problem: "I receive AI vendor pitch decks at work that cite GSM8K and MMLU scores. Published research documents specific contamination effects on those benchmarks. Here is what the research says."
2. Write from the buyer seat throughout. The voice is the informed practitioner evaluating tools, not an ML researcher critiquing model training.
3. If citing the 22.9% GSM8K figure, label it explicitly as an upper bound from a controlled worst-case experiment where researchers intentionally leaked half the test set, not a real-world observed inflation rate.

**Content brief:** Uses three sourced data points (Phi-3 5.3% GSM8K inflation from Microsoft technical report, Llama 2 16% MMLU contamination from arxiv 2412.15194, controlled worst-case GSM8K experiment upper bound from arxiv 2406.13990) to characterize benchmark reliability, then translates each finding into a practical question a non-ML buyer can ask any vendor before trusting a benchmark score.

**Reddit thread signal:** 11 threads on AI benchmark contamination; supported by verified arxiv research
**HN viability score:** 85/100 (LLM cluster alignment, practitioner framing differentiates from academic coverage, number hook in title)

**Verification required before writing:**
- Pull Phi-3 5.3% GSM8K figure directly from Microsoft Phi-3 technical report; confirm the exact number
- Confirm Llama 2 MMLU contamination rate is stated as "16%" in arxiv 2412.15194, not from a secondary summary
- Do not present 22.9% as a real-world observation

---

## Recommendation 3: CONDITIONAL

**Condition to clear:** Retrieve the 2003 IBM history-flow study and confirm the "under 60 seconds" response speed figure from the primary source. If that figure is absent, revise the title before writing. Confirm ClueBot NG current revert rate and deployment date from Wikimedia tool statistics.

**Title:** Wikipedia Resolves Most Vandalism in Under 60 Seconds: the Governance Architecture Behind It

**Format:** `.md`

**Core argument:** Wikipedia's vandalism response speed, documented in the 2003 IBM history-flow study and subsequent research, demonstrates that decentralized governance with the right tooling and incentive structure can maintain content integrity at scale, and no major AI content platform has deployed an equivalent architecture.

**Primary subreddit:** r/slatestarcodex, flair: n/a (link post standard), best time: Saturday 10am-noon ET
**Backup subreddit:** r/artificial, flair: Discussion
**HN viable:** Yes. HN title: "Wikipedia fixes most vandalism in under a minute. The governance model is worth studying."

**Submission tactics:**
1. Frame the r/slatestarcodex post body as a governance and incentives question, not a Wikipedia appreciation post. Ask the community whether any AI content moderation system has matched Wikipedia's documented response speed.
2. State explicitly which data points come from which study and which years, and name the methodological limits. The SSC community rewards epistemic precision.
3. Do not claim the vandalism rate has been "stable for 20 years." That claim is not supported by a continuous primary time-series and the SSC community will flag it.

**Content brief:** Uses sourced data from the 2003 IBM history-flow study, a 2007 University of Minnesota probability estimate, and 2012 edit-percentage data to characterize Wikipedia's vandalism response capability, then analyzes the three governance mechanisms (revert access incentives, watchlist system, ClueBot NG automation) that produce that outcome. Argues these mechanisms are transferable design principles for AI-generated content moderation.

**Reddit thread signal:** 26 threads on Wikipedia + AI authenticity angle
**HN viability score:** 68/100 (Society/AI overlap; novel governance angle; clean declarative title)

---

## Recommendation 4: CONDITIONAL

**Condition to clear:** Identify two or three specific documented PE deals where fee extraction preceded financial distress, all primary-sourced (SEC filings, court documents, or named journalism with citations). Confirm r/business rules on blog link submissions before any attempt.

**Title:** How Private Equity Extracts Management Fees Before Portfolio Companies Repay Debt

**Format:** `.md`

**Core argument:** The management fee and monitoring fee structure in leveraged buyouts transfers value to PE sponsors regardless of portfolio company outcome, a mechanic documentable in the public bankruptcy filings of Red Lobster, Toys R Us, Sears, and Party City.

**Primary subreddit:** r/slatestarcodex (framed as principal-agent failure analysis), best time: Saturday 10am-noon ET
**Backup subreddit:** r/business (rules unverified; submit as text post with no link, add link in first comment)
**HN viable:** Yes, but only with original deal-level data or first-person operator context. HN title: "The fee structure that pays PE sponsors whether or not the company survives"

**Submission tactics:**
1. The differentiation from Matt Stoller's BIG newsletter is the operator frame: Stoller covers PE as a political economy problem; this article documents the specific fee waterfall mechanics and traces the incentive misalignment at the deal level.
2. For r/slatestarcodex, frame as a principal-agent problem with quantified examples, not as a political critique. That community responds to mechanism, not outrage.
3. Do not submit as a straight opinion piece. The only version that earns distribution is one built around named deal structures with sourced mechanics.

**Content brief:** Maps the standard PE fee waterfall (management fees, monitoring fees, transaction fees, dividend recapitalizations) onto two or three documented buyout cases where the sponsor extracted fees while the portfolio company entered distress, using SEC filings, court documents, or named journalism as primary sources. Argues these mechanics are load-bearing to the PE model, not incidental.

**Reddit thread signal:** 21 threads on PE enshittification pattern
**HN viability score:** 75/100 (Finance/Labor cluster; named mechanics give number hook potential; declarative title)

---

## Recommendation 5: BENCHED

**Condition to clear before writing:**
- Inspect r/dataengineering sidebar to confirm blog link policy
- Identify a primary source documenting the curriculum revision gap (program syllabi comparison, hiring manager survey, BLS/LinkedIn data by cohort graduation year)
- Confirm the 56% AI skills premium figure from Let's Data Science 2026 against that source's stated methodology

**Title (if distribution path is confirmed):** Pre-2023 Data Science Master's Graduates Face a Skills Gap That Curriculum Changes Did Not Reach

**Format:** `.md`

**Core argument:** Data science master's programs revised curricula toward LLM-era skills in 2023 and 2024, leaving cohorts who graduated before those revisions with credential signals that hiring managers now treat as outdated.

**Status:** Benched until r/dataengineering rules are confirmed by direct inspection of the subreddit sidebar. That community (technical, practitioner-focused) is the only unverified but potentially viable distribution path. r/datascience allows blog-style content only in weekly threads. r/financialindependence prohibits blog links entirely.

**HN viable:** No. Career credential anxiety is not a front-page HN topic.

---

## Runner-Up Bench: 3 Ideas to Revisit

These three concepts were eliminated in Round 1. Return to them after the top 5 are published, if primary sources are confirmed and subreddit distribution paths verified.

**Bench Item 1: AI Slop Poisoning Reddit (84 threads)**
The "60% posts already fake" figure lacks a confirmed primary source. If the Cornell CHI 2025 paper (arxiv 2406.13990 or similar) is located and provides a verifiable percentage, this concept becomes high-priority. Target: r/artificial. The irony of posting to Reddit about Reddit AI content must be addressed in the post body directly.

**Bench Item 2: The US National Debt Interest Payment Milestone (25 threads)**
The House Budget Committee press release confirms interest costs exceeded defense spending. Blocked in Round 1 because r/Economics prohibits blogs. This becomes viable only if the article is structured as a practitioner piece (personal finance implications of the milestone) and submitted to r/personalfinance as a text post. Verify r/personalfinance rules on blog links before attempting.

**Bench Item 3: The Fed Independence Historical Pattern (29 threads)**
Eliminated in Round 1 due to author credibility gap on comparative central bank history. Remains viable if the Nixon 160-contact study receives a confirmed citation. If sourced, the target audience is r/slatestarcodex, not r/Economics, and the framing is historical pattern recognition rather than macroeconomic prediction.

---

## Pipeline Summary

Four adversarial rounds completed. Round 0 (advocate) generated 10 candidates. Round 1 (critic, high learning rate) eliminated 5 on saturation, unsupportable claims, or author credibility gaps. Round 2 (parallel: rules research + advocate sharpening) confirmed subreddit rules and patched remaining weaknesses. Round 2 critic pass re-scored against actual rules, exposing that most targeted subreddits prohibit personal blog posts. Round 3 (advocate, low learning rate) locked titles, distribution, and submission tactics. Two concepts emerged as publish-ready, two as conditional on specific verifications, one benched pending distribution path confirmation.
