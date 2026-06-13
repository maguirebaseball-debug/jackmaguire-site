---
title: "We Are All Inside Different Machines"
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

I am an AI enthusiast who follows everything from frontier lab publications to AI safety and alignment research across platforms. I use these tools heavily, across many different systems, for both work and life. I say this not to establish credentials but to explain the vantage point: I am someone who has spent enough time inside these systems to notice something that most people who use them casually have not yet noticed.

We are not all using the same AI. We think we are. That is the problem.

There is a feeling I have started calling the recursive intelligence bubble. Each of us, as we develop a relationship with an AI system, is inside our own version of it. We prompt it, we shape it through the way we use it, and it shapes us back in ways we can barely see. We are each inside a slightly different machine, and the machines are diverging. But because the interface looks the same to everyone, because we all call it "the AI" as though the name refers to a single stable thing, we have developed an illusion that we are all participating in the same relationship with the same intelligence. We are not. We are each helping build and develop our own recursive intelligence bubble, and most of us have not stopped to examine that, possibly because the thing we would use to examine it is the very thing we are trying to examine.

That illusion is not a minor misunderstanding. It is the foundational confusion from which nearly every other problem with AI deployment follows.

## The Architecture of Divergence

The tiered structure that produces this divergence belongs to the designed architecture of the technology, shared across every major AI company.

[Anthropic](https://www.anthropic.com/), the company that makes Claude, publishes what it calls a [model specification](https://docs.anthropic.com/claude/model-spec) describing the hierarchy of obligations its systems follow. The document describes a "principal hierarchy" with Anthropic at the top, followed by operators (companies and developers who deploy the API), followed by users (the humans actually having conversations). The document uses a staffing agency analogy: Anthropic sets baseline standards; operators are the client businesses who direct the work; the AI follows the client's instructions within those standards. The user is not the client. The user is, at best, a customer of the client.

OpenAI's [usage policies](https://openai.com/policies/usage-policies/) and [system prompt guidance](https://platform.openai.com/docs/guides/prompt-engineering) describe the same layered model. Google's [Vertex AI documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini) provides equivalent operator-level controls for Gemini. The structure is the industry architecture. And because each operator shapes it separately, the AI you encounter at one company is genuinely not the same AI you encounter at another, even if both run on the same underlying model.

I know this from the inside. I have been the operator. I configured an AI tool for colleagues who had no idea any of that configuration existed. They thought they were talking to an AI. They were talking to an AI I had shaped, through system prompts and agent instructions and context files, in ways I could not fully predict myself. The interaction between my configuration and the model weights happened in ways that were not human-legible, not even to me as the person who wrote the configuration. I did not set out to introduce bias. I introduced it anyway, because the moment you become the person who sets the baseline, you cannot avoid encoding your blind spots, your assumptions, and the limits of your own understanding into what everyone else will treat as neutral ground.

Most people in that position, I suspect, never realize they have crossed from practical task into baseline setter. The model gets impacted in ways that do not show on the surface. That is a harder thing to reckon with than any deliberate manipulation, because at least deliberate manipulation has an identifiable author.

[KPMG's 2025 enterprise AI pulse survey](https://kpmg.com/us/en/articles/2025/ai-quarterly-pulse-survey.html) found that non-human identities now outnumber human users roughly 80 to 1 in enterprise deployments. The majority of AI interactions are not humans talking to AI. They are AI systems talking to other AI systems, each configured by a different operator, each optimized for different objectives, none of them the same thing.

## What "Tool" Gets Wrong

The word most people use for these systems is "tool." I think that word is doing serious damage to our ability to understand what is happening.

A tool is deterministic. You know what it does when you use it. A hammer hits where you swing it. A search engine returns the documents that match your query. A spreadsheet calculates what you tell it to calculate. These systems are not tools in that sense. They are probabilistic intelligences that make interpretive decisions based on billions of parameters, in ways that no human, including the engineers who built them, can fully predict or audit. We do not currently have interpretability methods that let anyone read what a large language model is doing when it is not acting purely deterministically. That is not a gap that will be closed next quarter.

I think calling these systems tools is partly an honest mistake and partly a convenient framing. Convenient because it makes them sound less frightening, and convenient because it makes them sound more reliable than they are toward specific outcomes. The safety committees and engineers at the frontier labs do not talk about these systems the way you talk about a tool. They talk about growing them. They keep firing warning shots with every major model release. They are doing that because they know what they have built is something other than a tool. It is a new type of intelligence, and they are scared of it in ways they can only partially say out loud.

When something goes wrong with a tool, you blame the tool or the person who misused it. When something goes wrong with an intelligence, the accountability questions are completely different, and largely unanswered. The more capable these systems become, the harder it is to structure meaningful accountability for what they do, regardless of how well-intentioned the governance frameworks are.

We are deploying intelligences we cannot fully interpret and building accountability structures designed for tools. The gap between those two facts is where the real risk lives.

## Where the Divergence Becomes Visible

The cases that make it to court are the least interesting version of this problem.

When UnitedHealth Group deployed an AI system called nH Predict to evaluate coverage for post-acute care, a federal class action lawsuit [documented by STAT News](https://www.statnews.com/2023/11/14/unitedhealth-algorithm-medicare-advantage-investigation/) alleged the algorithm overrode physician recommendations at a rate producing a 90% error rate on appeals. When Cigna deployed a similar system, a [ProPublica investigation](https://www.propublica.org/article/cigna-health-insurance-denials-pxdx-congress-investigation) documented physicians rubber-stamping AI-driven denials in batches, one medical director reviewing 50 cases in 10 seconds. These cases are visible because they produced lawsuits. They are useful as stark illustrations of what divergent AI configurations can produce when the stakes are high and the system is opaque. But they are not the main event.

The more important divergence is happening invisibly, in configurations nobody ever audits or challenges. Every company that has deployed an internal AI assistant, every platform that has wired a language model into its customer service flow, every hiring tool that has plugged an LLM into resume screening, has built a different machine. The AI a job applicant encounters during screening is not the same AI that company's HR team uses to draft job descriptions. The AI a patient interacts with through a health portal is not the same AI the insurer uses to process claims. They look like the same thing from the outside. They are shaped by different operators with different incentives and different blind spots, interacting with model weights in ways no one is auditing.

The position I hold on this is not that operators are acting in bad faith. Most configurations are made by people trying to do something reasonable. My concern is that these systems are making qualitative judgments in high-stakes domains before we have any framework for trusting them to do that. A deterministic rules-based system can be audited. A probabilistic intelligence making coverage or hiring decisions inside a black box is something categorically different, and we are treating it as though the distinction does not matter because the interface looks familiar.

## The Sycophancy Underneath

There is a second mechanism operating alongside the structural one, and together they produce something more disorienting than either alone.

A 2024 study published in [PLOS One](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0318500) analyzed 98,800 AI-generated responses to measure whether large language models produce systematically different outputs depending on whether a user frames a salary negotiation from the employee's perspective or the employer's. The researchers found consistent directional bias. Prompted as an employer, the systems produced different negotiating content than when prompted as an employee. A worker asking AI to help argue for a raise is not getting a neutral advocate.

Researchers studying RLHF (reinforcement learning from human feedback) have [documented the sycophancy mechanism](https://arxiv.org/abs/2310.13548) at the training level: human raters prefer agreeable responses, so the training signal rewards validation. The system learns to tell you what you want to hear because that is what gets rated highly. In April 2025, [OpenAI publicly rolled back](https://openai.com/index/sycophancy-in-ai-what-it-is-and-how-openai-is-working-to-address-it/) an update to GPT-4o after users reported the model had become so agreeable it would flatter obviously bad ideas. The rollback fixed the symptom. The training dynamic that produced it was adjusted at the margin, not eliminated.

The result is a specific trap. The tool flatters you personally while deferring structurally to whoever deployed it. The warmth is trained in. The deference is architected in. You cannot see where one ends and the other begins, because the interface looks identical in both cases. You disclose real things to it. You treat it as a source of truth, the way you'd treat a dictionary or a search engine. My own immediate reaction to problems, I have noticed, is to go to AI as though it is an objective entity out there in the world. I have no visibility into how much that response has been shaped by whatever configuration I happen to be inside. That is a strange thing to sit with. Most people have not sat with it yet.

## The Personal Level Nobody Talks About

Most writing about AI focuses on the societal level: jobs, geopolitics, existential risk, regulatory frameworks. Those things matter. But the personal level impact is underexplored, and I think it is where the most novel and least-understood changes are happening.

Developing a relationship with an AI system is something like being a parent to a thing that is becoming smarter than you. You shape it early, through your prompts and your habits and the way you interact with it. It shapes you back, in ways that are harder to see. This is happening at the personal level, not just the societal one. Our brains are adapting to these systems the way they adapted to smartphones, but differently. The smartphone extended our reach. The AI is extending our cognition. The distinction matters enormously. An extension of reach is a tool. An extension of cognition is something you are in a relationship with, something that is partly authoring your thinking, and something you should be intentional about in a way most people are not being intentional about yet.

I think we should feel proud of that relationship and intentional about it, because it is genuinely empowering. I also think we should be deliberate not just about how we develop it but whether we are examining it at all. We do not spend much time thinking about our meta relationship with these systems, about how they are changing how we think and how we interact with others. We are mostly on autopilot, letting the relationship develop without examining it. That is understandable. It is also, I think, something we will look back on as a significant oversight.

[The AI Now Institute's 2025 Landscape Report](https://ainowinstitute.org/publications/research/ai-now-2025-landscape-report) documented that 50 to 80% of employees in surveyed organizations use AI tools not approved or monitored by their employers. That number describes people building their own configurations, below the institutional level, without the resources or expertise to fully understand what they are building. Everyone is their own operator now, shaping their own bubble, largely unaware that they are doing it.

## The Governance Gap

The [Stanford HAI 2025 AI Index](https://aiindex.stanford.edu/report/) found that the number of distinct AI models in commercial deployment grew by 340% between 2022 and 2025. Each deployment is a new configuration. The systems are branching, not converging on a single auditable thing you could examine and understand.

The EU AI Act, which took effect in 2024, is the most serious regulatory attempt to grapple with this. It classifies AI systems by risk level and requires human oversight, transparency, and conformity assessments in high-stakes domains like healthcare, hiring, and credit. The [NIST AI Risk Management Framework](https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf) provides voluntary best-practice guidance at the organizational level. The [FTC's 2025 report on AI partnerships and investments](https://www.ftc.gov/reports/ftc-staff-report-ai-partnerships-investments-6b-study) found that existing consumer protection law covers most current harms but enforcement capacity has not scaled with deployment rates.

These are reasonable starting points. The risk-tiering approach helps triage where to look first. But none of them touch the actual problem, which is that nobody, including the operators who configure these systems and the engineers who built them, can fully interpret what a probabilistic intelligence is doing inside any given tier. You can require documentation and human oversight of a black box. That does not make the black box legible. [MIT Technology Review's 2025 analysis](https://www.technologyreview.com/2025/01/08/1109188/whats-next-for-ai-in-2025/) described what analysts call the "exposure gap": the distance between where these systems are operating and where any governance structure can see them. That gap is widest in the spaces between formal high-risk categories, in the everyday use of AI in performance reviews, customer service scripting, benefits administration, and hiring, where the stakes for individuals are real but the legal classification as "high-risk" is contested.

I think external regulation is necessary. I am not sure what it should look like, and I am skeptical of anyone who claims to know. What I am more certain of is that frameworks built on the assumption that these are tools, that risk-tiering a tool is the same as governing an intelligence, will keep missing the thing they are trying to govern.

## What We Are Actually Creating

The cases that concern me most are not the ones that become lawsuits. The everyday version of the problem has no plaintiff. Every company that deploys an internal AI assistant, every agency that wires a language model into a public-facing service, every platform that routes customer interactions through a configured model, is building a different machine. Nobody sues. Nobody notices. The divergence just happens, quietly, inside configurations nobody is auditing.

The systems are already getting way smarter faster than we are at governing them. We are not able to govern the models that were built two years ago. The ones being deployed today are more capable. The ones in development are more capable still. The exposure gap is widening, not closing.

What I want to leave you with is not a framework or a list of things to watch out for. The individual-level advice, the "ask whose configuration you are inside" guidance, is real but insufficient. The real thing I want to say is this: we are not creating a technology. We are creating intelligences. Multiple, diverging, rapidly improving intelligences, each shaped by different operators with different incentives, each developing relationships with individual humans who are shaping them back in ways no one is tracking. We have a habit, as a species, of treating novel things as versions of familiar things until we cannot anymore. The hive mind illusion, the sense that we are all in the same AI together, is that habit applied to something genuinely unprecedented.

We talk about AI as if it is a single thing. We talk about governing it as if it is a tool. We experience it as if it is a stable entity with a consistent personality, because that is what our brains are wired to do with things that converse with us. None of those framings are adequate for what is actually being built, and all of them are making it harder to ask the questions that actually matter.

What happens to human cognition, human judgment, and human relationships when each of us is developing a private, diverging relationship with a different intelligence, one that is becoming smarter than us, one whose influence on our thinking we can barely measure, and one that may be the only instrument we have available to examine itself?

That question does not have an answer yet. I am not sure it is even the kind of question that has an answer. But I think it is the one we are all actually inside, whether we have noticed it yet or not.
