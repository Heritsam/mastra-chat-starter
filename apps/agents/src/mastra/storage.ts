import { DuckDBStore } from "@mastra/duckdb";
import { PostgresStore } from "@mastra/pg";
import { env } from "@repo/env/server";

export const postgresStorage = new PostgresStore({
  id: "mastra-storage",
  connectionString: env.DATABASE_URL,
});

export const duckdbStorage = await new DuckDBStore().getStore("observability");
