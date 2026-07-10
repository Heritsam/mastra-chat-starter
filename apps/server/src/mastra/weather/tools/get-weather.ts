import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const CONDITIONS = [
  "clear skies",
  "scattered clouds",
  "light rain",
  "thunderstorms",
  "foggy",
  "sunny",
] as const;

export const getWeatherTool = createTool({
  id: "get-weather",
  description: "Get the current weather for a given city.",
  inputSchema: z.object({
    location: z
      .string()
      .describe(
        "City name or location string to query weather for, e.g. 'Bogor, Indonesia' or 'Edinburgh'.",
      ),
  }),
  outputSchema: z.object({
    location: z.string().describe("The location that was queried."),
    weather: z
      .string()
      .nullable()
      .describe(
        "Weather summary string from wttr.in (format: 'City: condition temp'). Null on error.",
      ),
    error: z
      .string()
      .nullable()
      .describe("Error message if the request failed, null on success."),
  }),
  execute: async ({ location }) => {
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(location)}?format=3`,
      );

      if (!response.ok) {
        return {
          location,
          weather: null,
          error: `Weather service returned HTTP ${response.status}`,
        };
      }

      const weather = await response.text();
      return { location, weather: weather.trim(), error: null };
    } catch (err) {
      return {
        location,
        weather: null,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
});
