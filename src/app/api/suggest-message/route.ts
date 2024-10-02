import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export const POST = (async (request: Request) => {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai("gpt-4-turbo-preview"),
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
