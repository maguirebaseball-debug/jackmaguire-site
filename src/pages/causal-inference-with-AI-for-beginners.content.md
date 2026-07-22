Most businesses already have the raw material for a better growth model: lead timestamps, source fields, CRM statuses, sales activity, and payment records. The usual failure is not a shortage of data. It is asking a dashboard, a regression, or an AI model to answer a causal question it was never set up to answer.

If 80% of paid customers spoke to a salesperson, that does not mean making more calls will create 80% more customers. People who are ready to buy are more likely to answer the phone. If one traffic source has a stronger paid rate, that does not prove the source created more demand. It may have found people who already had more urgency.

AI makes this problem more dangerous because it can turn a correlation table into a confident operating recommendation in seconds. It also makes the disciplined version of the work much easier. A business owner can use AI to turn an undocumented funnel into a causal model, identify the questions their historical data can answer, and design the experiments needed for the questions it cannot.

The point is not to become an econometrician. The point is to stop optimizing a story your data cannot support.

## Start with a decision, not a dataset

The first question is never “which variables predict paid conversion?” The first question is: **what could we actually change?**

Good questions look like this:

- Would assigning new leads to the fastest available rep increase paid conversion?
- What would happen if follow-up happened within five minutes rather than thirty?
- Does a different offer presentation change the chance that a qualified lead pays?
- Which lead sources produce the most paid customers after the same amount of time has passed?

Each question needs a treatment, an outcome, a population, and a time zero. “Fast first response” is a treatment. “Paid within 90 days” is an outcome. “Leads created from January through March” is a population. “The moment the lead was submitted” is time zero.

By contrast, “inbound versus web form” may be a useful signal but often is not a treatment. It can reflect a person’s pre-existing urgency or intent. “Was contacted” is usually the same. A lead who responds is different from a lead who does not before a salesperson does anything. These fields are valuable for forecasting and triage. They should not quietly become evidence that a sales action caused a result.

## Draw the funnel before fitting a model

A directed acyclic graph, or DAG, is simply a picture of your assumptions about what happened first and what could affect what. Its job is not to prove causality. Its job is to expose the assumptions a spreadsheet otherwise hides.

Here is a simplified lead-funnel DAG:

```
Latent intent / urgency  ──► Contactability ──► Conversation ──► Paid
          │                         │                 │
          ├─────────────────────────┼─────────────────┘
          ▼                         ▼
Source / campaign ───────────────► Sales actions ────► Paid
          │
          ▼
Lead type, time, geography
```

The missing variable is the important one: intent, urgency, fit, and ability to pay. You may never observe it perfectly, yet it affects both funnel activity and the final payment. That means a historical model cannot cleanly tell you that a conversation caused payment merely because conversations and payments travel together.

The diagram also protects against a common mistake: controlling for a step that happens after the thing you want to study. If you are estimating the total effect of a campaign on paid conversion, do not adjust for whether the lead was contacted or reached a claim stage. Those may be part of how the campaign produces its effect. Adjusting for them can erase the pathway you are trying to measure, or create new bias.

The free tool [DAGitty](https://dagitty.net/) is useful here because it can inspect a proposed diagram and identify adjustment sets under the assumptions you put into it. That conditional phrase matters. Software can analyze a diagram. It cannot know whether your diagram matches the business.

## Separate three jobs that companies routinely mix together

The same CRM can support three different forms of analysis. They answer different questions and should not share one kitchen-sink model.

| Job | Question | Allowed inputs | What you can say |
| --- | --- | --- | --- |
| Forecasting | Which leads look most likely to pay? | Any information available when the prediction is made | “This lead is high probability.” |
| Funnel diagnosis | Where do cohorts separate? | Time-ordered stage outcomes | “This source has a lower conversation rate.” |
| Causal estimation | What happens if we change a controllable action? | Pre-treatment confounders and a defined intervention | “Changing this action is estimated to move paid conversion by X.” |

Forecasting is valuable. A lead score can help a sales team prioritize its day. It becomes misleading only when feature importance is relabeled as causal influence.

Funnel diagnosis is also valuable. It can reveal that one cohort is difficult to contact, another reaches qualification but fails at payment, and a third never gets a timely follow-up. That tells you where to investigate. It does not by itself prove the remedy.

Causal estimation has the highest bar because it claims to describe a counterfactual: what would have happened to the same type of lead under another operational choice. The basic language and logic are well covered in Hernán and Robins’ free book, [*Causal Inference: What If*](https://miguelhernan.org/whatifbook).

## The smallest useful data model

You do not need a data warehouse to begin. You do need a row-level table in which the order of events is honest.

For each lead, preserve:

- A stable lead ID and deduplication rule
- Lead creation time and acquisition source
- Intake facts known at submission, such as campaign, geography, device, product, or declared need
- Every operational action with a timestamp, including assignment, first attempted contact, successful contact, rep, cadence, and offer version
- The dates of meaningful funnel stages and payment
- A fixed observation window, such as paid within 90 days

The fixed window is essential. A lead created last week has had less chance to pay than one created six months ago. If you call the first one “unpaid” without accounting for that, you are measuring its youth, not its quality.

Keep fields even when they are incomplete. A missing source or state can itself describe an acquisition workflow. Do not let an AI tool quietly fill in business facts it cannot know.

## A practical AI workflow

AI is most useful before and around the model, where it can make the work legible and repeatable.

### 1. Ask AI to build a data dictionary

Upload column headers, definitions, and a handful of representative rows after removing personal information. Ask for a timeline table with these columns: field, event it represents, when it becomes known, whether it is controllable, and whether it could be affected by an earlier treatment.

This will surface obvious leakage. “Claim status,” “paid amount,” and “reached payment stage” are not legitimate predictors for a model meant to score a brand-new lead. They may be valid later-stage facts, but they cannot explain the earlier outcome without cheating.

### 2. Give the model the business story, then challenge it

Use a prompt like this:

> We want to estimate the effect of first-response time on paid conversion within 90 days. Leads differ in intent, urgency, source, availability, and time of day. Reps may prioritize leads that appear more promising. Draw a DAG with these variables. Mark likely confounders, mediators, colliders, unobserved causes, and post-treatment variables. State what must be true for the effect to be identifiable from historical data.

Then make the AI argue against its own first diagram. Ask what arrows might be missing, which variables are selected by the sales process, and which assumption would most change the conclusion. This second pass is where the tool is more useful than a generic “analyze my funnel” request.

### 3. Freeze the estimand in one sentence

Write an answer a finance or sales leader can recognize:

> Among leads created in Q1 with 90 days of observation, what is the expected difference in paid customers per 1,000 leads if first contact occurs within five minutes rather than after thirty minutes?

If the sentence cannot be written, the model is not ready. You have a reporting question, not a causal question.

### 4. Run an honest first estimate

For a binary treatment with reasonable overlap, a simple first approach is an outcome model plus g-computation. Estimate payment probability from the treatment and only the pre-treatment confounders. Then predict every eligible lead twice: once as if it received the faster response and once as if it received the slower response. The average difference is the estimated effect in a form management can use: additional paid customers per 1,000 leads.

The model can be Bayesian or regularized logistic regression. The important discipline comes first: use weak shrinkage for small groups, report uncertainty intervals, and do not let a rare source or a handful of payments produce a dramatic operational recommendation.

For a question with weak historical comparability, the right answer is not a fancier estimator. It is a test. Randomly assign a small, reversible routing or follow-up policy, track the same outcome window, and let the experiment create the comparison group the CRM could not.

## What to do with a small sample

Small samples are not useless. They are bad at supporting confident rankings.

If a business has 2,006 leads and 91 paid outcomes, it should treat the first analysis as a screening study. Pool rare sources. Limit the number of questions. Show absolute effects and wide intervals. Run sensitivity checks with different maturity windows and source thresholds. Look for findings that keep their direction when reasonable assumptions change.

A useful output is a decision tier, not a leaderboard:

- **Credible opportunity:** a meaningful estimated effect, enough comparable cases, and uncertainty narrow enough to act.
- **Promising but uncertain:** a potentially material effect that merits a controlled test.
- **Not identifiable:** too little overlap, too much missingness, selection in the funnel, or a treatment that is really just a signal of intent.

This is less exciting than declaring that a source, rep, or funnel status “drives” revenue. It is far more likely to improve the next decision.

## The operating model I would recommend

Every business owner should maintain three artifacts:

1. A one-page DAG for each important intervention.
2. A time-ordered funnel table with the lead’s maturity window clearly defined.
3. A decision log that records the question, assumptions, estimate, uncertainty, and next experiment.

AI can draft each of these, critique the data dictionary, write reproducible analysis code, and translate results into plain English. It should not be trusted to decide that correlation became causation because the chart looks clean.

The practical payoff is not an impressive model. It is a business that knows the difference between a lead characteristic, a warning signal, and a lever worth pulling. Once those categories are separate, the funnel gets much easier to improve.

## Further reading

- Miguel Hernán and James Robins, [*Causal Inference: What If*](https://miguelhernan.org/whatifbook)
- Johannes Textor et al., [DAGitty](https://dagitty.net/), a free tool for drawing DAGs and evaluating adjustment sets
- Textor et al., [“Robust causal inference using directed acyclic graphs: the R package ‘dagitty’”](https://academic.oup.com/ije/article/45/6/1887/2907796)
