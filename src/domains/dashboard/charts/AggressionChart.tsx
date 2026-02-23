import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Group, Text } from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";
import type { AggressionProfile } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import { Chip } from "@/shared/ui/primitives/Chip";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { StatDisplay } from "@/shared/ui/primitives/StatDisplay";
import { CHART_COLORS, AXIS_STYLE } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer]);

type Props = { profile: AggressionProfile };

export function AggressionChart({ profile }: Props) {
  const entries = Object.entries(profile.byGame).sort(([a], [b]) => a.localeCompare(b));
  const gameLabels = entries.map(([id]) => id);
  const scores = entries.map(([, s]) => s);
  const { avgScore, medianScore } = profile.summary;

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10,15,28,0.92)",
      borderColor: "rgba(148,163,184,0.15)",
      textStyle: { color: "#c0cbd8", fontFamily: "monospace", fontSize: 11 },
      formatter(params: unknown) {
        const items = params as { name: string; value: number; marker: string }[];
        if (!Array.isArray(items) || items.length === 0) return "";
        const item = items[0];
        return `<b>${item.name}</b><br/>Aggression: ${item.value.toFixed(2)}`;
      },
    },
    grid: { top: 12, left: 6, right: 6, bottom: 2, containLabel: true },
    xAxis: {
      type: "category",
      data: gameLabels,
      ...AXIS_STYLE,
      axisLabel: { ...AXIS_STYLE.axisLabel, rotate: 30, fontSize: 8 },
    },
    yAxis: {
      type: "value",
      ...AXIS_STYLE,
    },
    series: [
      {
        type: "bar",
        data: scores.map((v) => ({
          value: v,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(249,115,22,0.8)` },
              { offset: 1, color: `rgba(239,68,68,0.3)` },
            ]),
            borderRadius: [2, 2, 0, 0],
          },
        })),
        barWidth: "50%",
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed", width: 1 },
          data: [
            {
              yAxis: avgScore,
              label: {
                formatter: `avg ${avgScore.toFixed(1)}`,
                color: "rgba(148,163,184,0.6)",
                fontSize: 9,
                fontFamily: "monospace",
              },
              lineStyle: { color: CHART_COLORS.teal },
            },
            {
              yAxis: medianScore,
              label: {
                formatter: `med ${medianScore.toFixed(1)}`,
                color: "rgba(148,163,184,0.6)",
                fontSize: 9,
                fontFamily: "monospace",
              },
              lineStyle: { color: CHART_COLORS.yellow },
            },
          ],
        },
      },
    ],
  };

  return (
    <Panel variant="elevated" className={classes.aggregateCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconFlame size={16} color="var(--mantine-color-orange-4)" />
          <Caption size="sm">Aggression Profile</Caption>
        </Group>
        <Chip accent="orange" size="xs">
          <Text size="10px" fw={700} c="white">
            {profile.coverage.gamesWithRoundStats} Games
          </Text>
        </Chip>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 180, width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <Group gap={12} wrap="wrap">
        <StatDisplay value={profile.summary.avgScore.toFixed(2)} label="AVG" size="sm" />
        <StatDisplay value={profile.summary.medianScore.toFixed(2)} label="MED" size="sm" />
        <StatDisplay value={profile.summary.maxScore.toFixed(2)} label="MAX" size="sm" color="red.4" />
        <StatDisplay value={profile.summary.minScore.toFixed(2)} label="MIN" size="sm" color="teal.4" />
      </Group>
      <Text size="11px" c="gray.6" lh={1.3}>
        Weighted z-score: combats ({(profile.weights.combatsInitiated * 100).toFixed(0)}%) +
        planets stolen ({(profile.weights.planetsStolen * 100).toFixed(0)}%) +
        engagements ({(profile.weights.tacticalsWithCombat * 100).toFixed(0)}%).
        Peak: {profile.summary.mostAggressiveGameId}
      </Text>
    </Panel>
  );
}
