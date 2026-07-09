import { chatRoute } from "@mastra/ai-sdk";
import { Mastra } from "@mastra/core";
import { MessageList } from "@mastra/core/agent";
import { registerApiRoute } from "@mastra/core/server";
import { PostgresStore } from "@mastra/pg";
import { HTTPException } from "hono/http-exception";

import { helloAgent } from "./hello/agent";
import { weatherAgent } from "./weather/agent";

export const mastra = new Mastra({
  storage: new PostgresStore({
    id: "mastra-storage",
    connectionString: process.env.DATABASE_URL,
  }),
  agents: { weatherAgent, helloAgent },
  server: {
    apiRoutes: [
      chatRoute({
        path: "/chat/:agentId",
        sendReasoning: true,
        defaultOptions: {
          providerOptions: {
            google: { thinkingConfig: { includeThoughts: true } },
          },
        },
      }),
      registerApiRoute("/threads/:threadId/messages", {
        method: "GET",
        handler: async (c) => {
          const threadId = c.req.param("threadId");
          const agentId = c.req.query("agentId");
          const resourceId = c.req.query("resourceId");

          if (!agentId) {
            throw new HTTPException(400, { message: "agentId is required" });
          }

          const mastraInstance = c.get("mastra");
          const agent = mastraInstance.getAgent(agentId);
          const memory = await agent.getMemory();

          if (!memory) {
            throw new HTTPException(400, {
              message: "Memory is not initialized",
            });
          }

          const thread = await memory.getThreadById({ threadId });

          if (!thread) {
            return c.json({ uiMessages: [] });
          }

          const { messages } = await memory.recall({
            threadId,
            resourceId,
            perPage: false,
          });

          const list = new MessageList({ threadId, resourceId }).add(
            messages,
            "memory",
          );

          return c.json({ uiMessages: list.get.all.aiV5.ui() });
        },
      }),
    ],
  },
});
