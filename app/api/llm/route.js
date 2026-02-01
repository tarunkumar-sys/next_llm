// Import Ollama LLM
import { Ollama } from "@langchain/ollama";

// Import PromptTemplate
import { PromptTemplate } from "@langchain/core/prompts";

// Import RunnableSequence (modern replacement for LLMChain)
import { RunnableSequence } from "@langchain/core/runnables";

// API route
export async function GET() {

  // Create Ollama model instance
  const model = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "tinyllama",
  });

  // Create prompt template
  const prompt = new PromptTemplate({
    template: "Explain {topic} in very simple words",
    inputVariables: ["topic"],
  });

  // Create LCEL chain (Prompt → Model)
  const chain = RunnableSequence.from([
    prompt,
    model,
  ]);

  // Execute chain
  const result = await chain.invoke({
    topic: "LangChain",
  });

  // Return response
  return Response.json({
    success: true,
    answer: result,
  });
}
