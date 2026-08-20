import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartSeries = {
  key: string;
  label: string;
  type: "line" | "bar";
  axis: "left" | "right";
  color: string;
};

export type ToolChartSpec = {
  title: string;
  description?: string;
  xKey: string;
  series: ChartSeries[];
  data: Record<string, string | number>[];
};

export function ToolChart({ spec }: { spec: ToolChartSpec }) {
  const chartConfig = spec.series.reduce<ChartConfig>((config, series) => {
    config[series.key] = { label: series.label, color: series.color };
    return config;
  }, {});

  const hasRightAxis = spec.series.some((series) => series.axis === "right");

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">{spec.title}</CardTitle>
        {spec.description && (
          <CardDescription>{spec.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-96 w-full"
        >
          <ComposedChart
            data={spec.data}
            margin={{ top: 8, left: 8, right: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={spec.xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={56}
            />
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
              />
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {spec.series.map((series) =>
              series.type === "line" ? (
                <Line
                  key={series.key}
                  dataKey={series.key}
                  yAxisId={series.axis}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                />
              ) : (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  yAxisId={series.axis}
                  fill={series.color}
                  radius={4}
                />
              ),
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
