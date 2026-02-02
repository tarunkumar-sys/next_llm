import { Ollama } from "@langchain/ollama";

/**
 * Ollama LLM configuration
 * This is the brain of the agent
 */
export const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "tinyllama",
  temperature: 0.7, // fun + creative
});
