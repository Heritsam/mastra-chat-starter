import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const getCurrentLocation = createTool({
  id: "get-current-location",
  description:
    "Returns the user's current geographic location. " +
    "Use this when the user asks about weather 'here', 'near me', or 'my location' " +
    "and has not provided an explicit city or place. " +
    "Do not call this if the user already specified a location in their message.",
  outputSchema: z.object({
    location: z
      .string()
      .describe("City and country of the user's current location."),
    error: z
      .string()
      .nullable()
      .describe(
        "Error message if location could not be determined, null on success.",
      ),
  }),
  execute: async () => {
    try {
      const location =
        Math.random() < 0.5 ? "Bogor, Indonesia" : "Edinburgh, Scotland, UK";

      return { location, error: null };
    } catch (err) {
      return {
        location: "",
        error:
          err instanceof Error ? err.message : "Could not determine location",
      };
    }
  },
});
