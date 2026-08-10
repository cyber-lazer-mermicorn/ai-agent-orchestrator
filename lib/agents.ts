import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Agent Base Class
export abstract class Agent {
  protected name: string;
  protected model: any;
  protected tools: any[] = [];

  constructor(name: string) {
    this.name = name;
    this.model = openai('gpt-4-turbo-preview');
  }

  abstract getCapabilities(): string[];
  abstract getTaskTypes(): string[];

  async execute(task: string, context?: any) {
    try {
      const result = await generateText({
        model: this.model,
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: task },
        ],
        tools: this.tools.length > 0 ? this.tools.reduce((acc, t) => ({ ...acc, [t.name]: t }), {}) : undefined,
        maxSteps: 5,
      });

      return {
        agent: this.name,
        task,
        result: result.text,
        steps: result.toolCalls?.length || 0,
        success: true,
      };
    } catch (error: any) {
      return {
        agent: this.name,
        task,
        error: error?.message || 'Unknown error',
        success: false,
      };
    }
  }

  protected getSystemPrompt(): string {
    return `You are ${this.name}, an AI agent specialized in: ${this.getCapabilities().join(', ')}`;
  }
}

// Research Agent
export class ResearchAgent extends Agent {
  constructor() {
    super('Research Agent');
  }

  getCapabilities(): string[] {
    return ['web search', 'data synthesis', 'source verification', 'report generation'];
  }

  getTaskTypes(): string[] {
    return ['research', 'analyze', 'summarize', 'verify'];
  }

  protected getSystemPrompt(): string {
    return `You are a Research Agent. Your job is to gather information, verify sources, 
    and synthesize comprehensive reports. Always cite your sources and provide evidence.`;
  }
}

// Coding Agent
export class CodingAgent extends Agent {
  constructor() {
    super('Coding Agent');
  }

  getCapabilities(): string[] {
    return ['code generation', 'refactoring', 'testing', 'debugging', 'documentation'];
  }

  getTaskTypes(): string[] {
    return ['build', 'fix', 'test', 'document', 'refactor'];
  }

  protected getSystemPrompt(): string {
    return `You are a Coding Agent. Your job is to write, test, and debug code.
    Always follow best practices, add error handling, and include tests.`;
  }
}

// Orchestrator
export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();

  registerAgent(agent: Agent) {
    this.agents.set(agent.constructor.name, agent);
  }

  async routeTask(task: string): Promise<any> {
    // Simple routing based on keywords
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('research') || taskLower.includes('analyze') || taskLower.includes('summarize')) {
      const agent = this.agents.get('ResearchAgent');
      if (agent) return agent.execute(task);
    }
    
    if (taskLower.includes('code') || taskLower.includes('build') || taskLower.includes('fix')) {
      const agent = this.agents.get('CodingAgent');
      if (agent) return agent.execute(task);
    }

    // Default to first available agent
    const firstAgent = this.agents.values().next().value;
    if (firstAgent) return firstAgent.execute(task);

    return { error: 'No suitable agent found', success: false };
  }

  listAgents() {
    return Array.from(this.agents.values()).map(a => ({
      name: a.constructor.name,
      capabilities: a.getCapabilities(),
      tasks: a.getTaskTypes(),
    }));
  }
}