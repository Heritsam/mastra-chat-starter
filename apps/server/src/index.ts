import { env } from "@agent-ts/env/server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { MastraServer } from "@mastra/hono";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { mastra } from "./mastra";

const app = new OpenAPIHono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

const server = new MastraServer({ app, mastra });

await server.init();

app.get("/", (c) => {
  return c.text("OK");
});
app.get(
  "/docs",
  Scalar({
    url: `${env.MASTRA_STUDIO_URL}/api/openapi.json`,
    theme: "deepSpace",
  }),
);

app.doc("/api/docs", {
  openapi: "3.0.0",
  info: {
    title: "Agent Server",
    version: "1.0.0",
  },
});

export default app;
