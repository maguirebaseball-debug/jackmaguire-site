Practitioners who run AI agents across multi-hour or multi-day tasks observe a consistent degradation pattern. The session begins with a focused objective and a compact set of instructions. Each agent step appends observations, file contents, or intermediate results back into the active context. Over time the window fills with accumulated history. Later turns ignore constraints established at the outset. Outputs turn repetitive or drift from the plan. Per-turn cost rises with token volume. Practitioners in agent tooling communities call the pattern the context snowball.

The vantage point is that of a paid social media director who adopts AI research tools and agent workflows to aggregate distributed consensus and to support occasional complex analysis or script development. Over three years of intensive daily use, I have found that the introduction of sub-agents produced a marked shift in effectiveness. They enable the system to maintain multiple perspectives simultaneously, in a manner analogous to a structured discussion or the parallel processing of different cognitive functions. This structure appears to counteract the tendency, common in earlier single-pass interactions, for the model to converge rapidly on one initial response and then construct justifications around it. Instead, the requirement that perspectives interact and integrate encourages exploration along competing lines of inquiry before synthesis occurs. Direct experience with these tools for everyday problem solving is documented in [how I use AI to solve everyday problems](/blog/how-i-use-ai-to-solve-everyday-problems/). Claims in this piece rest on observed sessions rather than on controlled experiments or vendor telemetry. Personal observations receive explicit labeling as Tier 1 evidence. Patterns drawn from practitioner discussions appear as observed regularities rather than as statistical proof. While this approach has proven valuable for depth and balance in research and content pipelines, it has also highlighted the substantial token costs involved. The mechanisms and adjustments outlined here are intended to help others capture similar benefits with greater efficiency through small changes to project setups and instruction files.

One case shows the scale. A research and synthesis task that pulled data from multiple sources, cross-referenced outputs, and produced a structured report reached approximately 450,000 tokens before intervention. Latency rose. Early instructions on output format and scope dropped on later turns. The agent re-executed completed work. After externalization and gating practices described later, the same class of task finished with context held near 85,000 tokens. The reduction followed from external state and plan management, not from a smaller model or narrower scope.

The pattern is not unique to one tool or operator. You see the same dynamic in long-running agent sessions on practitioner forums and in reports on autonomous coding agents. Most implementations treat conversation history as the sole store for task state. Every observation and file read returns there. No automatic compression or external ledger exists by default. Context grows linearly with each action.

This piece examines the snowball in practice. It names the practices that produced the 450,000-to-85,000 token reduction in the observed case. It supplies a diagnostic checklist that practitioners can apply to their own sessions today. Subsequent sections detail the file-based externalization methods, the read-budget gates, and the out-of-band coordination techniques that bound context while preserving progress. Those controls address a dynamic that otherwise compounds until the session becomes slow, unreliable, or requires manual reset.

## The Snowball in Practice

The context snowball appears mid-task. A practitioner assigns an agent a research or development objective that requires repeated reads, data pulls, and refinement. Early turns stay focused. By turn fifteen the agent re-reads files already processed and includes large excerpts of prior outputs. It restates the opening objective because early instructions have receded. By turn thirty the session may exceed 200,000 tokens. Latency lengthens and useful work per turn falls.

In one Tier 1 case the task was multi-source research synthesis that required structured data pulls, cross-checks, and a sourced report. The session ran for hours. Context reached approximately 450,000 tokens. The agent dropped opening constraints. It ignored a rule to cite only primary sources. It re-queried sources already in the history. Latency required manual waits. The practitioner halted, extracted state, and restarted under external controls. The restarted session completed the identical objective at a peak of approximately 85,000 tokens. Useful work per turn stayed higher. No early constraints were lost.

The reduction did not come from a different model or a smaller task. It came from three practices used together: externalized plans and invariants, gated retrieval, and out-of-band coordination.

Practitioners maintain two small files in the workspace. PLAN.md holds the current objective, the ordered remaining steps, and the definition of done. INVARIANTS.md holds the non-negotiable rules on formats, sourcing, and prohibited actions. At the start of each major turn the agent reads both files in full before any other action. The files stay short and sit outside the conversation history, which prevents dilution as the window grows.

A read budget gate limits new material per turn. A typical gate caps the agent at 2,000 lines or three files. The agent must state intent before the read. The limit blocks the failure in which an agent dumps entire directories because more context seems better.

Tree-sitter supplies selective retrieval for code. A helper extracts only the relevant function or class. The fragment enters context with a label. The full file stays on disk. The agent requests more only if needed.

Out-of-band coordination isolates side communication. Agents write notes to a coordination file or queue. Other processes read on their schedule. The primary thread receives only the outcome or next step. The main conversation never absorbs the full side traffic.

A diagnostic identifies snowball pressure.

Try this diagnostic at the start of any session expected to exceed ten turns and every five turns after:

- Has the agent re-read a file or repeated a pull whose output already exists in recent history?

- Does current reasoning restate the objective or the PLAN.md step in different words?

- Has the agent included large prior blocks not requested this turn?

- Has latency increased since early turns?

- Are outputs omitting constraints explicit in the first three turns?

Two or more affirmative answers signal that context pressure is affecting behavior.

See how this plays out when the same controls meet production agent incidents that involve write access. The next section maps the practices onto three documented cases in which missing gates produced irreversible data loss and states the infrastructure equivalents that would have interrupted the snowball before execution.

The 85,000-token ceiling was the measured point at which PLAN.md, INVARIANTS.md read each cycle, the 2,000-line read budget, tree-sitter extraction, and out-of-band notes kept the agent on task without drift. Each element attacks a different accumulation source. External files remove state from the window. Gates limit inflow. Structured extraction favors precision over volume. Out-of-band channels keep coordination traffic separate. The combination turns linear growth into a bounded process.

## Where the Tokens Actually Go: Evidence from the 2026 Study

Bai et al. (2026) examined agent trajectories on SWE-bench Verified across eight frontier models. The central finding is that agentic coding tasks consume roughly 1000 times more tokens than ordinary code reasoning or multi-turn chat. Input tokens dominate the spend. The paper reports average task footprints around 4 million tokens, with input accounting for the majority even after caching.

Variance on identical tasks reaches 30x. Accuracy does not rise with spend. It often peaks at intermediate cost levels and saturates or declines when the agent continues to burn tokens on unproductive exploration. Models under-predict their own usage, with correlations at or below 0.39 for total tokens. Human-rated task difficulty shows only weak alignment with actual consumption.

The study isolates the mechanism. Full conversation history, including prior prompts and completions, carries forward unchanged into subsequent rounds. Tool results and file contents accumulate. Cache reads become the bulk of volume because the same prefix is re-presented. The input-heavy ratio persists even when providers apply discounts to repeated segments.

Practitioners see the same signatures. You see this pattern across [r/AI\_Agents](https://www.reddit.com/r/AI_Agents/), [r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/), and [Hacker News](https://news.ycombinator.com/) threads on agent tooling: sessions that begin with clean objectives drift into repeated re-execution, oversized context from prior turns, and silent model switches that multiply burn without warning. The paper supplies the quantitative frame. The sessions supply the operational cost.

## Root Causes: ReAct Loops, Tool Schemas, and the Compounding Effect

ReAct-style loops append the full prior trajectory on every turn. Thought, action, observation, and the original task restate themselves. The multiplier compounds with the number of steps and the size of each observation.

Tool schema bloat adds fixed overhead on every call. Definitions for dozens or hundreds of tools, including long natural-language descriptions and full parameter schemas, travel with the prompt even when the agent will invoke only one or two. Reports from harness builders describe static tool definitions alone consuming tens to hundreds of thousands of tokens before any user work begins.

Subagent spawning introduces its own overhead. Each subagent often receives a copy of current state or a "world view." Without explicit contracts for summaries and fresh contexts, the orchestrator still ingests the expanded trace. Handoffs become another source of repeated context.

The absence of read budgets and external ledgers completes the loop. Agents default to requesting more context because more information appears to reduce risk. No gate enforces "read only the slice required for this decision." State lives only in the conversation window.

These are not independent. A ReAct loop with bloated schemas and no external ledger produces the 30x variance on identical tasks. The same task with different exploration paths or different model behaviors diverges sharply in total spend.

## Concrete Wins and Before/Afters

One observed research synthesis run crossed 450,000 tokens before intervention. The agent re-read sources, restated constraints, and lost early scoping rules. After introduction of PLAN.md for current state, INVARIANTS.md for non-negotiable rules, a 2,000-line read budget per turn, tree-sitter extraction for code context, and out-of-band notes for coordination, the equivalent task peaked near 85,000 tokens. Useful work per turn rose. The human reviewed an append log rather than re-prompting to clear drift.

Dynamic tool discovery produces similar ratios. One implementation reduced input tokens by average 96 percent and total spend by 90 percent on tasks that previously loaded full tool catalogs on every call. Success rate remained 100 percent across the benchmark set.

Code execution patterns over direct tool calls deliver 98 percent class reductions on data-heavy flows. The agent writes code that fetches, filters, and aggregates outside the model context. Only the minimal result returns.

Structured extraction instead of raw dumps follows the same logic. One web agent pipeline replaced full HTML payloads with targeted fields and summaries. Token volume on the retrieval step dropped by factors reported in the 10x range while preserving the information required for the decision.

External memory and compaction close the loop for long sessions. Summaries replace prior turns. Stable facts move to files or vector stores that the agent queries on demand. The conversation window holds only the current working set.

These are not isolated anecdotes. The ratios align with reported results from multiple harnesses and with the input-dominant, high-variance profile in the 2026 study.

## Guardrails and Implementation Patterns

Read budget gates enforce intent before inflow. The agent states the decision it needs to make and the minimal slice required. Calls that would exceed the current headroom are refused until the agent summarizes what it already holds.

Tree-sitter and AST graphs replace raw source for code. A one-time parse produces function signatures, imports, and structural scores. The agent receives the graph plus a short architectural note per module. Later turns request only the specific symbol.

Dynamic and progressive tool discovery defers schema loading. The agent first searches or lists categories. Only the schemas for tools it selects enter the prompt. Static catalogs of hundreds of tools no longer travel on every turn.

Prompt compaction and compression keep history bounded. Automatic or explicit summaries replace earlier turns when thresholds are crossed. Stable prefixes (system instructions, tool definitions, cached context) stay ordered at the front so providers can apply discounts.

External state and out-of-band coordination remove the orchestrator from the critical path. PLAN.md and INVARIANTS.md live on disk. Agents read them on first turn and append decisions only. Side communication travels through files or queues rather than the main transcript.

Subagent discipline requires fresh contexts and summary-only returns. Subagents receive narrow briefs. They return concise outcomes plus pointers to artifacts. The orchestrator never ingests the full subagent trace unless explicitly requested for debug.

These patterns compose. A harness that applies read budgets, tree-sitter extraction, dynamic discovery, ordered prefixes for caching, external plans, and summary-only subagents produces the 70-to-90 percent class reductions on the tasks that previously compounded.

## Measurement, Habits, and When It Still Fails

Per-turn logging of input, output, cache hits, and success or accuracy metrics turns the cost curve visible. A weekly audit flags runs that deviate from their prior-week baseline. Correlation between spend and outcome quality reveals which tasks benefit from more context and which do not.

The 30x variance on identical tasks is inherent. Two runs of the same objective with different exploration orders or different model stochasticity can diverge by that factor. Lower spend does not guarantee higher accuracy. Some tasks require the volume; many do not.

Model differences are real. One frontier model may consume 1.5 million more tokens on the same task set while delivering comparable or lower accuracy. Self-prediction of total spend remains weak. Agents systematically underestimate the input growth that comes from their own trajectories.

Subagents add overhead when the contract is not enforced. A subagent that returns its full reasoning trace re-creates the snowball inside the orchestrator. Fresh contexts and explicit summary requirements are necessary.

Tree-sitter and indexing carry an upfront cost. The parse runs once per change set. For stable codebases the amortization is favorable. For rapidly changing files the benefit shrinks.

Not every task is a long-horizon agent run. Simple chat or single-turn reasoning shows none of these multipliers. The controls matter most where the loop length or the number of participants would otherwise compound.

## Conclusion

The controls exist today. They require no new model releases. They require only that the harness treat context as a budgeted, externalized resource rather than an ever-growing transcript.

Start with measurement on one recurring task. Add one guardrail: a read budget or an out-of-band plan file. Observe the change in spend and in outcome quality. Iterate from there.

The same pattern that turns a four-hour research army from hundreds of thousands of tokens into a bounded process applies to any workflow where repeated context would otherwise dominate the bill.

See how the underlying research workflows that surface these costs operate in practice in [how I use AI to solve everyday problems](/blog/how-i-use-ai-to-solve-everyday-problems/). Related agent control lessons appear in the analysis of three documented database deletions in [ai coding agents deleted databases](/blog/ai-coding-agents-deleted-databases/). The tools that make the caching and extraction steps practical appear in [recommendations for apps](/recommendations/apps/).

Citations link directly to the primary papers and vendor documentation listed below. The author's vantage point is as a practitioner who runs these sessions inside marketing and research workflows rather than as an AI researcher or infrastructure engineer.


## Additional Wins from Production Harnesses

Teams report consistent ratios when the same controls are applied to coding agents. One harness that previously burned through context on every subagent handoff for codebase search now uses pre-computed graphs and returns only the relevant symbol plus a one-paragraph note. The reported cut was 120x on retrieval steps while pass rate on the benchmark held or improved. The mechanism is parse once, query forever. The file system holds the structure. The conversation holds only the decision.

Another pattern appears in multi-agent research armies. Without out-of-band coordination, each subagent must be re-briefed on the current state or the orchestrator must carry the full transcript. Either path scales with the number of agents and the length of the run. With a shared PLAN.md that every participant reads on first turn and appends to on decision, the orchestrator reviews only the append log. The human cost and the token cost both drop.

Dynamic toolsets show the same effect on MCP servers. A catalog of 400 tools that previously injected hundreds of thousands of tokens on every call now requires the agent to search or list categories first. Only the schemas for the tools it selects enter the prompt. Input tokens fell 96 percent on average in the reported benchmarks. Total spend fell 90 percent. Success rate stayed at 100 percent.

Code execution over direct tool invocation follows the identical logic. The agent writes the aggregation or filter locally. Only the minimal result crosses back. One documented flow that previously passed a 50,000-token transcript through the model multiple times now passes a few hundred tokens of summary. The data never enters the context unless it is needed for the final decision.

## Primary Sources

1. [Bai, L. et al. (2026). How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks. arXiv:2604.22750](https://arxiv.org/abs/2604.22750)
2. [Bai et al. PDF](https://arxiv.org/pdf/2604.22750)
3. [Project site / data (Longju Bai)](https://longjubai.github.io/agent_token_consumption)
4. [Stanford Digital Economy Lab summary](https://digitaleconomy.stanford.edu/news/how-are-ai-agents-spending-your-tokens/)
5. [ZDNet coverage of the paper (May 2026)](https://www.zdnet.com/article/your-cost-for-ai-agents-will-be-wildly-variable-and-unpredictable/)
6. [Microsoft LLMLingua GitHub](https://github.com/microsoft/LLMLingua)
7. [Microsoft Research blog on LLMLingua](https://www.microsoft.com/en-us/research/blog/llmlingua-innovating-llm-efficiency-with-prompt-compression/)
8. [LLMLingua-2 paper (arXiv:2403.12968)](https://arxiv.org/abs/2403.12968)
9. [Speakeasy: How we reduced MCP token usage by 100x - Dynamic Toolsets v2](https://www.speakeasy.com/blog/how-we-reduced-token-usage-by-100x-dynamic-toolsets-v2)
10. [Speakeasy: Comparing Progressive Discovery (100x+)](https://www.speakeasy.com/blog/100x-token-reduction-dynamic-toolsets)
11. [Zyte: Why AI agents struggle with web scraping](https://www.zyte.com/blog/why-ai-agents-struggle-with-web-scraping/)
12. [Zyte: Why 10 million tokens won't save your AI agent](https://www.zyte.com/blog/why-10-million-tokens-wont-save-your-ai-agent/)
13. [Anthropic: Prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
14. [Anthropic Engineering: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
15. [Anthropic Engineering: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
16. [Vogel et al. (2026). Codebase-Memory: Tree-Sitter-Based Knowledge Graphs. arXiv:2603.27277](https://arxiv.org/pdf/2603.27277)
17. [How I Cut My AI Coding Agent's Token Usage by 120x With a Code Knowledge Graph](https://dev.to/deusdata/how-i-cut-my-ai-coding-agents-token-usage-by-120x-with-a-code-knowledge-graph-4a3d)
18. [etr/wonk: Structure-aware code search (tree-sitter)](https://github.com/etr/wonk)
19. [Hacker News: OpenClaw Creator Spent $1.3M on OpenAI Tokens in 30 Days](https://news.ycombinator.com/item?id=48159227)
20. [Yao et al. ReAct: Synergizing Reasoning and Acting in Language Models. arXiv:2210.03629](https://arxiv.org/abs/2210.03629)
21. [Tian Pan: Retry Budgets for LLM Agents](https://tianpan.co/blog/2026-04-16-retry-budget-llm-agent-cost-amplification)
22. [SurePrompts: Context Engineering: The 2026 Replacement for Prompt Engineering](https://sureprompts.com/blog/context-engineering-the-2026-replacement-for-prompt-engineering)
23. [Redis: How to Build AI Agents with Redis Memory Management](https://redis.io/blog/build-smarter-ai-agents-manage-short-term-and-long-term-memory-with-redis/)
24. [Redis Agent Memory Server (GitHub ref impl)](https://github.com/redis/agent-memory-server)
25. [Microsoft / Azure: Supercharging AI Agents with Memory on Azure Managed Redis](https://techcommunity.microsoft.com/blog/azure-managed-redis/supercharging-ai-agents-with-memory-on-azure-managed-redis/4457407)
26. [Anthropic: Advanced tool use / Tool Search (context management)](https://www.anthropic.com/engineering/advanced-tool-use)
27. [GitHub discussions on Codex subagent token overcounting](https://github.com/ryoppippi/ccusage/issues/950)
28. [Zyte: Agentic web scraping](https://www.zyte.com/blog/agentic-web-scraping/)
29. [arXiv:2605.20049 on code cleanliness and token impact](https://arxiv.org/abs/2605.20049)
