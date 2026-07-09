import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

import { instructions } from "./prompts/system";
import { getCurrentLocation } from "./tools/get-current-location";
import { getWeatherTool } from "./tools/get-weather";
import { suggestActivities } from "./tools/suggest-activities";

export const weatherAgent = new Agent({
  id: "weatherAgent",
  name: "Weather Agent",
  instructions,
  model: google("gemini-2.5-flash"),
  tools: { getWeatherTool, getCurrentLocation, suggestActivities },
  memory: new Memory({
    options: {
      generateTitle: true,
      observationalMemory: {
        enabled: true,
        scope: "thread",
      },
    },
  }),
});
