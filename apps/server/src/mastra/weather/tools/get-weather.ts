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
    city: z.string().describe("The city to get the weather for"),
  }),
  outputSchema: z.object({
    city: z.string(),
    temperatureC: z.number(),
    condition: z.string(),
    humidity: z.number(),
    windKph: z.number(),
  }),
  execute: async ({ city }) => {
    // Deterministic pseudo-random values derived from the city name so the
    // same city always returns the same "weather" during testing.
    const seed = [...city].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return {
      city,
      temperatureC: 8 + (seed % 22),
      condition: CONDITIONS[seed % CONDITIONS.length] ?? "sunny",
      humidity: 40 + (seed % 55),
      windKph: 3 + (seed % 28),
    };
  },
});
