import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Group, Text } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";
import type { StrategyCardStats } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import { Chip } from "@/shared/ui/primitives/Chip";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { SC_NAMES, SC_COLORS, AXIS_STYLE } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

type Props = { stats: StrategyCardStats };

export function StrategyCardChart({ stats }: Props) {
  const scKeys = Object.keys(stats.bySc).sort((a, b) => Number(a) - Number(b));
  const labels = scKeys.map((k) => SC_NAMES[k] ?? `SC ${k}`);
  const gamesData = scKeys.map((k) => stats.bySc[k].gamesPicked);
  const winRateData = scKeys.map((k) => stats.bySc[k].winRateWhenPicked);
  const barColors = scKeys.map((k) => SC_COLORS[k] ?? "rgb(148,163,184)");

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10,15,28,0.92)",
      borderColor: "rgba(148,163,184,0.15)",
      textStyle: { color: "#c0cbd8", fontFamily: "monospace", fontSize: 11 },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: "rgba(148,163,184,0.7)", fontSize: 9 },
      itemWidth: 8,
      itemHeight: 8,
    },
    grid: { top: 28, left: 6, right: 6, bottom: 2, containLabel: true },
    xAxis: {
      type: "category",
      data: labels,
      ...AXIS_STYLE,
      axisLabel: { ...AXIS_STYLE.axisLabel, rotate: 0, fontSize: 8 },
    },
    yAxis: [
      {
        type: "value",
        name: "Games",
        nameTextStyle: { color: "rgba(148,163,184,0.5)", fontSize: 9 },
        ...AXIS_STYLE,
      },
      {
        type: "value",
        name: "Win %",
        nameTextStyle: { color: "rgba(148,163,184,0.5)", fontSize: 9 },
        ...AXIS_STYLE,
        axisLabel: { ...AXIS_STYLE.axisLabel, formatter: "{value}%" },
      },
    ],
    series: [
      {
        name: "Games Picked",
        type: "bar",
        yAxisIndex: 0,
        data: gamesData.map((v, i) => ({
          value: v,
          itemStyle: { color: barColors[i], opacity: 0.5 },
        })),
        barWidth: "38%",
        itemStyle: { borderRadius: [2, 2, 0, 0] },
      },
      {
        name: "Win Rate",
        type: "bar",
        yAxisIndex: 1,
        data: winRateData.map((v, i) => ({
          value: v,
          itemStyle: { color: barColors[i], opacity: 0.9 },
        })),
        barWidth: "22%",
        itemStyle: { borderRadius: [2, 2, 0, 0] },
      },
    ],
  };

  return (
    <Panel variant="elevated" className={classes.aggregateCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconChartBar size={16} color="var(--mantine-color-teal-4)" />
          <Caption size="sm">Strategy Card Performance</Caption>
        </Group>
        <Chip accent="teal" size="xs">
          <Text size="10px" fw={700} c="white">
            {stats.meta.gamesWithRoundStats}/{stats.meta.completedGamesConsidered}
          </Text>
        </Chip>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 190, width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <table className={classes.dataTable}>
        <thead>
          <tr>
            <th>SC</th>
            <th className={classes.alignRight}>Picks</th>
            <th className={classes.alignRight}>Games</th>
            <th className={classes.alignRight}>Wins</th>
            <th className={classes.alignRight}>Win %</th>
          </tr>
        </thead>
        <tbody>
          {scKeys.map((k) => {
            const s = stats.bySc[k];
            return (
              <tr key={k}>
                <td className={classes.label}>{SC_NAMES[k] ?? `SC ${k}`}</td>
                <td className={classes.alignRight}>{s.totalPicks}</td>
                <td className={classes.alignRight}>{s.gamesPicked}</td>
                <td className={classes.alignRight}>{s.winsInGamesPicked}</td>
                <td className={classes.alignRight}>{s.winRateWhenPicked.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
