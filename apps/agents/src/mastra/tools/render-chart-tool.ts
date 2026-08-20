import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const seriesSchema = z.object({
  key: z.string().describe("Field name in each data row for this series"),
  label: z.string().describe("Human-readable label for the legend/tooltip"),
  type: z
    .enum(["line", "bar"])
    .describe("Chart mark for this series. Mix 'line' and 'bar' across series to combine them in one chart."),
  axis: z
    .enum(["left", "right"])
    .default("left")
    .describe(
      "Which y-axis this series plots against. Use 'right' for a second series with a different unit/scale (dual-axis chart).",
    ),
});

export const renderChartTool = createTool({
  id: "render-chart",
  description:
    "Render tabular data (typically from query-threadline-data) as a chart in the chat UI. " +
    "Each series picks its own 'type' ('line' for trends, 'bar' for comparisons), so a single chart can combine lines and bars, " +
    "and set two series with different 'axis' values for a dual-axis chart (e.g. revenue vs. units sold).",
  inputSchema: z.object({
    title: z.string(),
    description: z.string().optional(),
    xKey: z
      .string()
      .describe("Field name in each data row used for the x-axis"),
    series: z.array(seriesSchema).min(1).max(4),
    data: z
      .array(z.record(z.string(), z.union([z.string(), z.number()])))
      .describe("Rows of data, each containing xKey and every series key"),
  }),
  outputSchema: z.object({
    title: z.string(),
    description: z.string().optional(),
    xKey: z.string(),
    series: z.array(
      seriesSchema.extend({
        color: z.string(),
      }),
    ),
    data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  }),
  execute: async (inputData) => {
    const series = inputData.series.map((item, index) => ({
      ...item,
      color: `var(--chart-${(index % 5) + 1})`,
    }));

    return { ...inputData, series };
  },
});
