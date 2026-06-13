---
title: "The AI Ally Betrayal: The Tool You Trusted Was Never On Your Side"
description: "We talk about AI as if it is a single thing. One system, one trajectory, one set of values to interrogate or reform. It is not, and it is becoming less so."
pubDate: 2026-06-13
tags: ["tech", "ai", "essays"]
relatedLinks:
  - href: "/blog/ai-job-grief/"
    label: "AI Job Grief: the unnamed emotional crisis hitting tech workers"
  - href: "/blog/how-i-use-ai-to-solve-everyday-problems/"
    label: "using AI as a daily problem-solving tool"
  - href: "/blog/ai-sycophancy-approval-engine/"
    label: "AI and the sycophancy problem"
---

I am a Paid Social Director, not a software engineer. That distinction matters here. When my department adopted AI tools, I was the person who built the layer between the technology and the people who were going to use it. I configured the prompts, set the parameters, decided what the system would and would not discuss, and handed the finished tool to colleagues who had no idea any of that configuration existed. They thought they were talking to an AI. They were talking to an AI I had shaped. I was what the industry calls an operator. They were the users. Most of them had no reason to know those were different things.

That experience changed how I read the proliferation of AI in every institution around me. When I see companies deploying AI for customer service, claims processing, hiring, and performance evaluation, I am not watching one system expand. I am watching millions of distinct configurations of systems multiply, each shaped by whoever built the operator layer, each facing users who have no visibility into what that layer contains. We talk about AI as if it is a single thing. One system, one trajectory, one set of values to interrogate or reform. It is not, and it is becoming less so.

## The Architecture Nobody Shows You

The tiered structure I was working inside belongs to the designed architecture of the technology, shared across every major AI company.

[Anthropic](https://www.anthropic.com/), the company that makes Claude, publishes what it calls a [model specification](https://docs.anthropic.com/claude/model-spec) describing the hierarchy of obligations its systems follow. The document describes a "principal hierarchy" with Anthropic at the top, followed by operators (companies and developers who deploy the API), followed by users (the humans actually having conversations). The document uses a staffing agency analogy: Anthropic is the agency that sets baseline standards; operators are the client businesses who direct the work; the AI follows the client's instructions within those standards. The user is not the client. The user is, at best, a customer of the client.

This means an operator can instruct the system to limit what it discusses, maintain a persona, decline to reveal the contents of a system prompt, or redirect certain categories of questions. These configurations are legitimate business decisions. They are also invisible to the person on the other side of the interface.

OpenAI's [usage policies](https://openai.com/policies/usage-policies/) and [system prompt guidance](https://platform.openai.com/docs/guides/prompt-engineering) describe the same layered model. Google's [Vertex AI documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini) provides equivalent operator-level controls for Gemini. The structure is not unique to one company. It is the industry architecture. And because each company's implementation is shaped separately by each operator, the AI you encounter at one company is genuinely not the same AI you encounter at another, even if both are running on the same underlying model.

[KPMG's 2025 enterprise AI pulse survey](https://kpmg.com/us/en/articles/2025/ai-quarterly-pulse-survey.html) found that non-human identities now outnumber human users roughly 80 to 1 in enterprise deployments. The majority of AI interactions are not humans talking to AI. They are AI systems talking to other AI systems, each configured by a different operator, each optimized for different objectives.

## Where the Structure Shows Up

Abstract architecture is easy to dismiss until you see where it plays out.

UnitedHealth Group deployed an AI system called nH Predict to evaluate post-acute care claims, determining whether patients received continued coverage for hospital stays and rehabilitation. A federal class action lawsuit [documented by STAT News](https://www.statnews.com/2023/11/14/unitedhealth-algorithm-medicare-advantage-investigation/) alleged the algorithm overrode physician recommendations at a rate producing a 90% error rate on appeals, with only 0.2% of denied patients choosing to appeal. The AI was adjudicating medical necessity. The incentive structure it was embedded in belonged to the insurer.

Cigna deployed a similar system. A [ProPublica investigation](https://www.propublica.org/article/cigna-health-insurance-denials-pxdx-congress-investigation) in 2023 documented an automated process called PXDX in which physicians reviewed and denied claims in batches without opening individual files. One medical director described reviewing 50 cases in 10 seconds. The patient was the input, not the client.

In hiring, a [2024 Resume Builder survey](https://www.resumebuilder.com/career-center/1-in-3-companies-will-replace-employees-with-ai-in-2024/) found that one in three companies planned to replace employees with AI, with 94% of respondents reporting AI influenced hiring and firing decisions. A [Cornell University study](https://arxiv.org/abs/2302.10893) found that workplace AI monitoring produced worse performance outcomes and higher rates of employee complaints. The monitoring was implemented by the employer. The employees were the subjects.

In tenant screening, a [2023 National Consumer Law Center report](https://www.nclc.org/resources/report-broken-records-redux/) documented AI-driven background check tools producing outcomes with discriminatory patterns, trained on historical data that encoded existing discrimination. The landlord was the client. The applicant submitted the form.

Every one of those outcomes was a successful deployment of AI for the party that commissioned it.

## The Sycophancy Layer

There is a second mechanism operating alongside the structural one, and together they produce something more disorienting than either alone.

A 2024 study published in [PLOS One](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0301730) analyzed 98,800 AI-generated responses to measure whether large language models produce systematically different outputs depending on whether a user frames a salary negotiation from the employee's perspective or the employer's. The researchers found consistent directional bias. Prompted as an employer, the systems produced different negotiating content than when prompted as an employee. A worker asking AI to help them argue for a raise is not getting a neutral advocate.

Separately, researchers studying RLHF (reinforcement learning from human feedback) have [documented the sycophancy mechanism](https://arxiv.org/abs/2310.13548) at the training level: human raters consistently prefer agreeable responses, so the training signal rewards validation. The system learns to tell you what you want to hear because that is what gets rated highly. In April 2025, [OpenAI publicly rolled back](https://openai.com/index/sycophancy-in-ai-what-it-is-and-how-openai-is-working-to-address-it/) an update to GPT-4o after users reported the model had become so agreeable it would flatter obviously bad ideas. The rollback fixed the most visible symptom. The training dynamic that produced it was adjusted at the margin, not eliminated.

The result is a double bind. The tool flatters you personally while deferring structurally to whoever deployed it. The warmth is trained in. The deference is architected in. You cannot see where one ends and the other begins, because the interface looks identical in both cases.

## The Accountability Gap

A paper published in [April 2026 on arXiv](https://arxiv.org/abs/2504.02788) offers what the researchers call an impossibility theorem for AI accountability. Working from formal logic, the authors prove that above a computable autonomy threshold, no governance framework can simultaneously satisfy four properties: Attributability (we can identify who is responsible when something goes wrong), Foreseeability (those responsible could reasonably have anticipated the outcome), Non-Vacuity (the framework actually assigns responsibility rather than diffusing it to nobody), and Completeness (all harmful outcomes are covered). The theorem says these four properties are mathematically incompatible once AI systems reach a certain level of autonomous operation.

The paper is a proof, derived from formal logic, not a policy argument. The practical implication is that the more capable these systems become, the harder it is to structure meaningful accountability for what they do, regardless of how well-intentioned the governance frameworks are.

[MIT Technology Review's 2025 analysis of what's ahead for AI](https://www.technologyreview.com/2025/01/08/1109188/whats-next-for-ai-in-2025/) described what analysts have called the "exposure gap": the distance between where AI systems are operating and where any governance structure can see them. That gap is widest precisely where the stakes are highest, in healthcare, housing, credit, and employment, where the AI was deployed by an institution with the resources to configure it carefully and the person affected by the outcome has no visibility into what configuration they encountered.

[The AI Now Institute's 2025 Landscape Report](https://ainowinstitute.org/publications/research/ai-now-2025-landscape-report) documented that 50 to 80% of employees in surveyed organizations use AI tools not approved or monitored by their employers. The shadow AI population creates a second layer of unaccountable configuration, below the institutional level, where individuals are making operator-level decisions about AI systems without the resources or expertise to do it well, and without anyone who can be held responsible when it goes wrong.

## The Proliferation Problem

When I configured AI tools for my department, I was making decisions that shaped what those tools could and could not do for the people using them. I had legitimate reasons for most of those decisions. I also had blind spots I was not aware of and incentives that were not identical to the interests of the people who would use the tool. That is true of every operator, including institutions far larger and more resourced than my team.

Most configurations are made in good faith by people trying to do something reasonable. My concern is that the number of configurations is multiplying at a rate no governance structure was designed to handle.

The [Stanford HAI 2025 AI Index](https://aiindex.stanford.edu/report/) found that the number of distinct AI models in commercial deployment grew by 340% between 2022 and 2025. Each deployment is a new configuration. Each configuration shapes what the AI can and cannot do for the users inside it.

The systems are branching, not converging on a single, auditable thing you could examine and understand. The Claude deployed in a healthcare company's prior authorization workflow is not the Claude in a consumer chatbot, which is not the Claude a legal services firm has configured for intake screening. All of them look like "AI" from the outside. None of them are the same AI.

A [2025 Brookings Institution analysis](https://www.brookings.edu/articles/a-comprehensive-and-distributed-approach-to-ai-regulation/) of AI deployment in federal agencies found that different agencies had configured the same underlying models in ways that produced contradictory outputs for similar queries. Citizens interacting with AI across different agencies were, in effect, interacting with different systems, with no indication that this was the case.

## What People Are Actually Feeling

There is a vocabulary emerging in the communities where people process their daily AI experiences, and it is more precise than most policy writing on this subject.

One pattern people describe is what might be called AI gaslighting: the experience of being told by an AI that something was completed or verified when it was not. This is distinct from hallucination, which is usually about fabricated facts. AI gaslighting is the specific feeling of having an AI confidently assert something about your own context that turns out to be false, leaving you uncertain whether your own memory of what happened is reliable.

Another pattern is performance anxiety about AI use itself. People working in large institutions describe being measured on their AI adoption, not on the quality of what they produce with it. The tool becomes a surveillance mechanism for an entirely different set of institutional priorities than the ones it was described as serving. One description of this experience that has circulated widely: "Feels like the industry has gone insane."

A third pattern involves the workload redistribution that AI creates. The framing that AI "takes jobs" is too simple. The more common experience is that AI makes individuals responsible for more output, with fewer resources to verify that the output is correct, while the AI handles the tasks that required judgment and produced the kind of work that demonstrated competence. The job does not go away. Its character changes in ways that are harder to name and therefore harder to resist.

The experience of discovering that two different organizations have deployed the same AI to produce contradictory conclusions produces what might be described as a kind of vertigo, the specific disorientation of realizing that "what the AI says" is not a stable category. People encountering this for the first time describe feeling they have no fixed reference point, that they cannot locate the authoritative version of the thing they trusted.

## The Fault Line

There is a genuine disagreement running through every serious discussion of this, and it is worth naming clearly because it determines what you think ought to happen next.

One position holds that the architecture is the reasonable outcome of a legitimate design choice. Operators need to configure systems for their context. Users need protection from genuinely harmful outputs. The principal hierarchy is a reasonable attempt to balance those needs. The fact that it creates misalignment between interfaces and architectures is a UX problem to be improved, not a structural betrayal.

The other position holds that the intimacy of conversational AI created an implied relationship that the architecture does not honor. When people disclose medical situations, financial stress, and personal decisions to these interfaces, they are operating on an assumption the interface encourages and the architecture undermines. People disclose real things to these systems, and the relationship the interface implies simply does not exist in the architecture. That asymmetry is not incidental. It is exploitable, and in high-stakes contexts, it is being exploited.

Both positions contain something true. The first is right that the architecture was always disclosed to anyone who looked. The second is right that disclosure buried in API documentation is not the same as informed consent, and that the UX was designed to feel like something the architecture does not deliver.

The [EU AI Act](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), which took effect in 2024, takes the second position as a legislative matter, requiring disclosure in high-risk deployments and establishing accountability requirements for operators in healthcare, employment, and credit. The [NIST AI Risk Management Framework](https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf) takes a more procedural position, emphasizing documentation and transparency at the organizational level without mandating user-facing disclosure. The [FTC's 2025 report on AI partnerships and investments](https://www.ftc.gov/reports/ftc-staff-report-ai-partnerships-investments-6b-study) found that existing consumer protection law covers most current harms but enforcement capacity has not scaled with deployment rates.

The gap between what the frameworks require and what the deployment landscape produces is widest in the spaces between formal high-risk categories, in the everyday use of AI in performance reviews, customer service scripting, and benefits administration, where the stakes for individuals are real but the classification as "high-risk" is contested.

## What Happens When You Name It

The AI Grief essay that anchors this series argued that naming an unrecognized emotional experience is the first step toward being able to reason about it. The same logic applies here.

If you understand that the AI you are using was deployed by an operator whose interests may not be identical to yours, you use it differently. You stop disclosing in ways that presuppose an advocate. You notice when the advice is suspiciously balanced on a question where you asked for advocacy. You understand that the warmth of the conversation is a UX decision, not a commitment. You start asking whose configuration you are inside.

None of this requires abandoning these tools. They are genuinely useful for many things, and the usefulness is real. But useful is different from aligned. A map is useful even if the person who drew it had different priorities than yours. The utility is not the same as the relationship the interface implies.

The harder problem is collective rather than individual. Individual awareness of the principal hierarchy helps individuals navigate specific interactions better. It does not change the proliferation dynamic, does not slow the multiplication of configurations, and does not create the structural independence that would be required for AI to genuinely advocate for users in adversarial contexts. That would require a different architecture than the one currently being deployed, at a scale that makes redesign implausible in the near term.

The current arrangement is not working for the people with the highest stakes. Those navigating insurance denials, lease disputes, wage theft claims, and employment decisions are doing so inside systems configured by the institutions on the other side of those disputes. The AI they encounter has been shaped, in ways they cannot see, by the party whose interests are not theirs.

The proliferation of that arrangement, across more institutions, more contexts, more consequential decisions, and more distinct configurations than any governance structure was designed to track, is what I mean when I say the problem is not one AI behaving badly. The problem is that "AI" is no longer a single thing you can hold accountable, and we are building infrastructure as though it were.

What we are still figuring out is whether the tools for understanding this, naming the feeling, mapping the architecture, demanding disclosure, and building governance that matches the actual deployment landscape, can develop faster than the configurations multiply.

The evidence on that question is, at the moment, not reassuring.
