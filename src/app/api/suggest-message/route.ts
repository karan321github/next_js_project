import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const openai = createOpenAI({
  apiKey:
    "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", // It's a good practice to use environment variables for API keys
});

export const POST = async (request: Request) => {
  try {
    // Parse incoming request body to get messages
    const { messages } = await request.json();

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Ensure messages is an array
    if (!Array.isArray(messages)) {
      return new Response(
        "Invalid request body. 'messages' should be an array.",
        {
          status: 400,
        }
      );
    }

    // Stream the result from OpenAI API using GPT-3.5 turbo
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      prompt,
    });

    // Return the result
    return new Response(JSON.stringify({ questions: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /suggest-message:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
