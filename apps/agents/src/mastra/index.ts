import { chatRoute } from "@mastra/ai-sdk";
import { toAISdkMessages } from "@mastra/ai-sdk/ui";
import { Mastra } from "@mastra/core/mastra";
import { registerApiRoute } from "@mastra/core/server";
import { MastraCompositeStore } from "@mastra/core/storage";
import { PinoLogger } from "@mastra/loggers";
import {
  MastraPlatformExporter,
  MastraStorageExporter,
  Observability,
  SensitiveDataFilter,
} from "@mastra/observability";
import { HTTPException } from "hono/http-exception";
import { threadlineAnalystAgent } from "./agents/threadline-analyst-agent";
import { duckdbStorage, postgresStorage } from "./storage";

export const mastra = new Mastra({
  agents: { threadlineAnalystAgent },
  storage: new MastraCompositeStore({
    id: "composite-storage",
    default: postgresStorage,
    domains: {
      observability: duckdbStorage,
    },
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    apiRoutes: [
      chatRoute({
        path: "/chat/:agentId",
        version: "v7",
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
          const agent = mastraInstance.getAgentById(agentId);
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

          return c.json({
            uiMessages: toAISdkMessages(messages, { version: "v7" }),
          });
        },
      }),
    ],
  },
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [
          new MastraStorageExporter(), // Persists observability events to Mastra Storage
          new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});
