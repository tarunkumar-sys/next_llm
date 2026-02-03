import { Ollama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { NextResponse } from "next/server";
import { z } from "zod";

const AnswerSchema = z.object({
  answer: z.string().max(300).refine(v => v.split("\n").length <= 2),
});

export async function POST(req) {
  const { messages } = await req.json();
  const lastUserMessage = messages?.at(-1)?.content ?? "";

  const model = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "tinyllama",
    temperature: 0.1,
  });

  const prompt = new PromptTemplate({
    inputVariables: ["question"],
    template: `
You are IoTSolvez Customer Care Assistant.

RULES:
- Max 2 short lines
- No greetings unless user greets
- No guarantees, pricing, refunds
- Output ONLY JSON

JSON format:
{{ "answer": "text" }}

Question:
{question}
`,
  });

  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const stream = await chain.stream({ question: lastUserMessage });
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      let fullText = "";

      for await (const chunk of stream) {
        fullText += chunk;
      }

      // 🔍 Extract JSON safely
      const match = fullText.match(/\{[\s\S]*?\}/);

      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          const validated = AnswerSchema.parse(parsed);
          controller.enqueue(encoder.encode(validated.answer));
        } catch {
          controller.enqueue(
            encoder.encode("Please rephrase your question.")
          );
        }
      } else {
        controller.enqueue(
          encoder.encode("Please rephrase your question.")
        );
      }

      controller.close();
    },
  });

  return new NextResponse(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
