import { google } from "@ai-sdk/google";
import { createTool } from "@mastra/core/tools";
import { generateText } from "ai";
import { z } from "zod";

export const suggestActivities = createTool({
  id: "suggest-activities",
  description:
    "Suggest activities based on the user's current weather. " +
    "Use this after the user fetching current weather. " +
    "When the user asking for activity suggestion before knowing the weather, fetch the weather first.",
  inputSchema: z.object({
    weather: z
      .string()
      .nullable()
      .describe(
        "Weather summary string from wttr.in (format: 'City: condition temp'). Null on error.",
      ),
  }),
  outputSchema: z
    .string()
    .describe(
      "A list of suggested activities for the user in a format of string.",
    ),
  execute: async ({ weather }) => {
    const model = google("gemini-2.5-flash");
    const prompt =
      "Suggest activities based on the user's current weather. " +
      "Use this after the user fetching current weather. " +
      "When the user asking for activity suggestion before knowing the weather, fetch the weather first. " +
      `Current weather: ${weather}`;

    const { text } = await generateText({ model, prompt });

    return text;
  },
});
