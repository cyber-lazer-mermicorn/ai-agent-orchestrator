# GitHub Copilot Instructions — AI Agent Orchestrator

## Always
- Implement agents as classes in `lib/agents/` with typed `run(input: AgentInput): Promise<AgentOutput>`
- Register all tools in `lib/tools/registry.ts` before use
- Type all handoff messages with `HandoffMessage`
- Emit OpenTelemetry spans for every agent step
- Make state transitions exhaustive — default case throws

## Never
- Allow inline tool definitions outside the registry
- Swallow agent errors silently
- Use untyped messages between agents

## Pattern: agent
```typescript
class ResearchAgent implements Agent {
  async run(input: AgentInput): Promise<AgentOutput> {
    const span = tracer.startSpan('research-agent');
    try {
      // ...work...
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (e) {
      span.recordException(e as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw e;
    } finally { span.end(); }
  }
}
```
