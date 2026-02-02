import { ollama } from "../llm/ollama";
import { tools } from "../tools/index";
import { AGENT_PROMPT } from "./prompt";

/**
 * createAgent
 * Returns a minimal agent-like object with an `invoke` method.
 * This keeps the API route working even if a full agent runtime
 * isn't wired up. If `ollama.call` is available it will be used;
 * otherwise the agent falls back to a simple echo-style reply.
 */
export async function createAgent() {
  return {
    async invoke({ input }) {
      const prompt = `${AGENT_PROMPT}\nUser: ${input}\nAssistant:`;

      try {
        if (ollama && typeof ollama.call === "function") {
          const res = await ollama.call(prompt);
          return { output: typeof res === "string" ? res : String(res) };
        }
      } catch (err) {
        console.warn("ollama call failed:", err?.message || err);
      }

      // Fallback reply when no LLM is available
      return { output: `Agent stub reply: ${input}` };
    },
  };
}
