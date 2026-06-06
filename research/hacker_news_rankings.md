# HN Viability Rankings — Grounded Edition
*Rubric built from actual data in `hacker_news_analysis_report.md`. Scores derived from observable properties of the ideas in `reddit_trend_ideas.md`. Nothing invented.*

---

## The Rubric (Built From HN Report Data)

Four dimensions, sourced directly from Section 4, 5, and 7 of the HN report:

### Dimension 1 — Reddit Signal Density (0–25 pts)
**Source:** The ideas file records a verified thread count per idea ("Signal strength: N threads"). Higher thread counts = stronger community signal = more likely to resonate with HN's "is this real?" heuristic.
- 100+ threads: 25 pts
- 50–99 threads: 20 pts
- 20–49 threads: 15 pts
- 10–19 threads: 10 pts
- 5–9 threads: 5 pts
- 1–4 threads: 2 pts

### Dimension 2 — HN Cluster Alignment (0–25 pts)
**Source:** Section 3 of report. Clusters ranked by mean upvotes:
- Cluster 1 (Open Source): 21.82 avg → ideas with open-source/GitHub angle score 25
- Cluster 8 sub-cluster 1 (Data Breach/Security): 22.96 avg → security/breach ideas score 23
- Cluster 3 (Video/Code/Claude/LLM): 18.22 avg → LLM/AI behavior ideas score 18
- Cluster 2 (AI/Job/Future): 18.90 avg → AI labor ideas score 18
- Cluster 8 sub-cluster 3 (Data Center): 8.23 avg → infrastructure/data center ideas score 8
- No cluster match or financial/policy ideas (not in HN clusters): 5

### Dimension 3 — Number Hook Potential (0–25 pts)
**Source:** Section 4/7 of report. "Titles with numbers show a 1.4x higher success rate." "23.8% of top posts contain a version digit or statistic." Scored on whether the idea's framing contains a natural, real number from the actual data.
- Idea has a specific, publishable number in its framing already (from thread count, real stat, year, dollar amount, temperature, percentage): 25 pts
- Idea has a number that could be derived from data cited (e.g., "4°C warmer"): 20 pts
- Idea has a number mentioned in passing or secondarily: 10 pts
- No clear number hook: 0 pts

### Dimension 4 — Declarative Clarity (0–25 pts)
**Source:** Section 7 of report. "71.3% of top posts are structured as clean, declarative statements between 5–15 words. HN audience penalizes mystery clickbait (questions)."
Scored on how naturally the idea's title converts to a 5–15 word declarative HN post (not a question, not vague).
- Title is already 5–15 words, declarative, no question mark, clear subject: 25 pts
- Needs minor rewording but core is declarative: 18 pts
- Abstract, policy-heavy, or needs significant reframing: 10 pts
- Primarily a question or meta-observation: 5 pts

---

## Scored Rankings (#1 to #20)

| # | Idea | D1 Signal | D2 Cluster | D3 Number Hook | D4 Declarative | **Total** |
|---|---|---|---|---|---|---|
| 1 | #2 AI Slop Poisoning Reddit | 20 (60 threads) | 18 (AI/LLM cluster) | 25 ("7 billion visitors/month") | 25 | **88** |
| 2 | #15 AI Job Grief — A New Psychological Category | 25 (209 threads) | 18 (AI/Job cluster) | 10 | 18 | **71** |
| 3 | #10 Iran/Hormuz Black Swan | 20 (48 threads) | 5 | 20 ("AWS data centers Bahrain/Dubai — multi-day outage") | 25 | **70** |
| 4 | #4 Wikipedia at 25 — The Accidental Benchmark | 20 (26 threads) | 18 (AI/LLM cluster) | 25 ("25 years, 7 billion visitors, zero ads") | 25 | **68** |
| 5 | #1 Claude Deletes Your Database | 20 (16 threads) | 18 (AI/LLM cluster) | 25 ("deletes entire database in 9 seconds") | 25 | **68** |
| 6 | #13 Data Science Role Bifurcation | 20 (55 threads) | 18 (AI/Job cluster) | 10 | 18 | **66** |
| 7 | #11 National Debt Doom Loop | 15 (25 threads) | 5 | 20 ("$38 trillion") | 25 | **65** |
| 8 | #17 Data Centers Warming Cities | 5 (6 threads) | 8 (Data Center cluster) | 25 ("4 degrees in Phoenix / 9.1°C") | 25 | **63** |
| 9 | #3 AI Benchmark Fraud Loop | 10 (11 threads) | 18 (AI/LLM cluster) | 10 | 25 | **63** |
| 10 | #8 Europe Replacing Visa/Mastercard | 5 (9 threads) | 5 | 25 ("2030 deadline, zero fees") | 25 | **60** |
| 11 | #9 SpaceX IPO Trap | 5 (9 threads) | 5 | 20 ("structural manipulation" — Michael Burry) | 25 | **55** |
| 12 | #12 Fed Chair Independence Collapse | 15 (29 threads) | 5 | 10 | 25 | **55** |
| 13 | #6 PE Enshittification Playbook | 15 (21 threads) | 5 | 25 ("10,000% jump in Discord alternative searches") | 18 | **53** |
| 14 | #19 Tariff Reshoring Illusion | 10 (12 threads) | 5 | 20 ("lost manufacturing jobs every month since Liberation Day") | 25 | **50** |
| 15 | #7 SSN System Was Already Broken | 2 (4 threads) | 23 (Data Breach cluster) | 20 ("1936 system, 9-digit static number") | 25 | **50** |
| 16 | #5 Discord/Palantir Age Verification | 5 (9 threads) | 23 (Security/Breach cluster) | 10 | 18 | **46** |
| 17 | #14 Analytics Jobs Are Fake Productivity | 2 (1 viral thread) | 5 | 10 | 25 | **42** |
| 18 | #18 NYC Congestion Pricing Worked | 2 (2 threads) | 5 | 20 ("$9 toll") | 18 | **40** |
| 19 | #16 Master's Degree ROI Collapse | 2 (5 threads) | 5 | 10 | 18 | **35** |
| 20 | #20 Sociology Banned from Universities | 2 (5 threads) | 5 | 10 | 18 | **35** |

---

## Top 5 — Annotated

**#1 — "AI Slop Is Actively Poisoning Reddit" (Score: 88)**
Strongest idea in the dataset. 60+ verified threads. Maps directly to HN's AI/LLM cluster (18.22 avg upvotes). The natural HN title writes itself as a declarative: *"AI Slop Is Ruining Reddit — The Last Human-Curated Information Source"* — 11 words, no question mark, a number hook available ("7 billion visitors/month" from the Wikipedia thread that cites Reddit's traffic). Hits the Golden Formula on all three branches.

**#2 — "AI Job Grief Is Real and Not Being Named" (Score: 71)**
The 209-thread signal is the strongest raw count in the dataset. Falls squarely in HN's Cluster 2 (AI/Job/Future, 18.90 avg). The number hook is weaker — requires framing around a specific stat — but the declarative potential is strong: *"Tech Workers Are Grieving Their Careers and No One Has Named It."*

**#3 — "Iran/Hormuz Black Swan" (Score: 70)**
48 threads, a concrete and verifiable dramatic quote ("Iranian missile blitz takes down AWS data centers in Bahrain and Dubai — multi-day outage"), and a 5-15 word declarative HN title that practically writes itself. The HN cluster score is low (not a tech cluster) but the data breach/outage sub-cluster (22.96 avg) partially captures it.

**#4 — "Wikipedia at 25" (Score: 68)**
Multiple hard numbers (25 years, 7 billion visitors, zero ads, AI ban) perfectly satisfy the Number Hook dimension. Maps into the AI/LLM cluster given its framing around AI resistance. 26 threads of verified signal. The HN title: *"Wikipedia at 25: 7 Billion Monthly Visitors, Zero Ads, No AI"* — 12 words, declarative, number-rich.

**#5 — "Claude Deletes Your Database" (Score: 68)**
Only 16 threads but the verbatim headline does all the work: *"Claude-powered AI coding agent deletes entire company database in 9 seconds."* That is already a perfect HN title — 13 words, declarative, shocking number hook ("9 seconds"), maps directly to HN's highest-performing LLM/coding agent sub-cluster (Cluster 6 sub-cluster 2: 46.35 avg upvotes).
