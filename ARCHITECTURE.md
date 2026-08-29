# Architecture

## Overview
Multi-agent orchestration system with typed handoffs, tool registry, FSM state management, and full OpenTelemetry observability.

## Layers

| Layer | Path | Responsibility |
|---|---|---|
| Agents | `lib/agents/` | Agent class implementations |
| Tool Registry | `lib/tools/registry.ts` | Central tool registration + lookup |
| State Machine | `lib/state/` | FSM for agent workflow state |
| Observability | `lib/telemetry/` | OpenTelemetry setup + span helpers |
| API Routes | `app/api/` | HTTP entry points for agent runs |
| Tests | `__tests__/` | Agent unit tests with mocked tools |

## Agent lifecycle
Create → Register tools → Run (with span) → Emit handoff or terminal result → Emit completion span.
