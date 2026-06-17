# Default LLM model for this project

Any LLM/agent/script working in this folder should default to the model below
unless the task clearly needs more. Source of truth:
~/.claude/openrouter-project-models.yaml (verified 2026-06-15).

- Model: anthropic/claude-sonnet-4.6
- Tier: premium
- Why: frontend code you ship; use deepseek-v3.2 for cheap drafts

Use via OpenRouter (https://openrouter.ai/api/v1), OpenAI-compatible API, key OPENROUTER_API_KEY.
