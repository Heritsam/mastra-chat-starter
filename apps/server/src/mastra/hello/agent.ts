import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

export const helloAgent = new Agent({
  id: "helloAgent",
  name: "Hello Agent",
  instructions: "You're Claude. Act like Claude.",
  model: google("gemini-2.5-flash"),
  tools: {},
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
