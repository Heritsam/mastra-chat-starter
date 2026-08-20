import { createTool } from "@mastra/core/tools";
import { db } from "@repo/db";
import { sql } from "drizzle-orm";
import { z } from "zod";

const forbiddenKeywords =
  /\b(insert|update|delete|drop|alter|truncate|grant|revoke|create|copy|call|execute|merge|pg_sleep)\b/i;

function assertReadOnlySelect(query: string) {
  const trimmed = query.trim().replace(/;\s*$/, "");

  if (trimmed.includes(";")) {
    throw new Error("Only a single SQL statement is allowed");
  }
  if (!/^select\b/i.test(trimmed)) {
    throw new Error("Only SELECT statements are allowed");
  }
  if (forbiddenKeywords.test(trimmed)) {
    throw new Error("Query contains a disallowed keyword");
  }

  return trimmed;
}

export const queryThreadlineDataTool = createTool({
  id: "query-threadline-data",
  description:
    "Run a read-only PostgreSQL SELECT query against the Threadline apparel store database. " +
    "Available tables: " +
    "threadline_products(id, name, category, price, created_at), " +
    "threadline_customers(id, name, email, region, signup_date), " +
    "threadline_sales(id, product_id, customer_id, quantity, unit_price, revenue, region, sale_date). " +
    "Only a single SELECT statement is allowed — no writes, DDL, or multiple statements.",
  inputSchema: z.object({
    sql: z
      .string()
      .describe(
        "A single read-only PostgreSQL SELECT statement, e.g. " +
          "'SELECT category, SUM(revenue) AS revenue FROM threadline_sales JOIN threadline_products ON threadline_products.id = threadline_sales.product_id GROUP BY category ORDER BY revenue DESC'",
      ),
    reason: z
      .string()
      .describe(
        "One sentence on why this query answers the user's question — helps catch a wrong query before it's presented as an answer.",
      ),
  }),
  outputSchema: z.object({
    columns: z.array(z.string()),
    rows: z.array(z.record(z.string(), z.unknown())),
    rowCount: z.number(),
    truncated: z.boolean(),
    note: z.string().optional(),
  }),
  execute: async (inputData) => {
    const rowLimit = 500;
    const query = assertReadOnlySelect(inputData.sql);
    const result = await db.execute(
      sql.raw(`SELECT * FROM (${query}) AS query_result LIMIT ${rowLimit}`),
    );
    const rows = result.rows as Record<string, unknown>[];
    const columns = rows.length ? Object.keys(rows[0]) : [];
    const truncated = rows.length === rowLimit;

    return {
      columns,
      rows,
      rowCount: rows.length,
      truncated,
      ...(truncated && {
        note: `Result was cut off at ${rowLimit} rows. Narrow the query (add a WHERE filter, GROUP BY, or LIMIT/ORDER BY) instead of relying on this raw result being complete.`,
      }),
    };
  },
});
