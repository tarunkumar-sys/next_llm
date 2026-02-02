import { createAgent } from "@/lib/agent/agent";

/**
 * POST /api/llm
 * Main AI agent endpoint
 */
export async function POST(req) {
  try {
    const { message } = await req.json();

    const agent = await createAgent();

    const result = await agent.invoke({
      input: message,
    });

    return Response.json({ reply: result.output });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Agent failed" },
      { status: 500 }
    );
  }
}
