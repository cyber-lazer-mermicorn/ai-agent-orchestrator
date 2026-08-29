# AI Agent Orchestrator — Agent Doctrine

## What this repo is
Production-grade multi-agent orchestration: parallel agents, handoffs, tool registries, state machines, and observability.
By Cherry Shanaley (Chan), AI Solutions Engineer.

## Tech stack
- **Framework:** Next.js 15 + TypeScript strict
- **Orchestration:** Custom agent runtime + Vercel AI SDK
- **State:** Finite state machine pattern (no third-party FSM lib)
- **Observability:** OpenTelemetry spans per agent step
- **Deployment:** Vercel

## Coding rules
- Each agent is a class in `lib/agents/` implementing the `Agent` interface
- Tool registry in `lib/tools/registry.ts` — register tools there, not inline
- Agent handoffs use typed `HandoffMessage` — never pass raw strings between agents
- State transitions must be exhaustive — unhandled states throw, never silently ignore
- All agent runs emit an OpenTelemetry span with `agent.name`, `agent.step`, `agent.status`
- Max concurrent agents: configurable via `AGENT_CONCURRENCY` env var

## Commands
```bash
npm install && npm run dev
npm run test
npm run lint
```

## Do not
- Allow agents to call tools not in the registry
- Silently swallow agent errors — always emit error span and rethrow
- Use global mutable state for agent context
