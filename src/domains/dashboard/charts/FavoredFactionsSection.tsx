import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Group, Text } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import type { FavoredFaction } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import { AXIS_STYLE } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

type Props = { factions: FavoredFaction[] };

export function FavoredFactionsSection({ factions }: Props) {
  if (factions.length === 0) return null;

  const labels = factions.map((f) => f.faction);
  const gamesData = factions.map((f) => f.gamesPlayed);
  const winsData = factions.map((f) => f.wins);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10,15,28,0.92)",
      borderColor: "rgba(148,163,184,0.15)",
      textStyle: { color: "#c0cbd8", fontFamily: "monospace", fontSize: 11 },
    },
    grid: { top: 12, left: 6, right: 6, bottom: 2, containLabel: true },
    xAxis: {
      type: "category",
      data: labels,
      ...AXIS_STYLE,
      axisLabel: { ...AXIS_STYLE.axisLabel, fontSize: 8 },
    },
    yAxis: {
      type: "value",
      ...AXIS_STYLE,
    },
    series: [
      {
        name: "Games",
        type: "bar",
        data: gamesData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `rgba(148,163,184,0.5)` },
            { offset: 1, color: `rgba(148,163,184,0.15)` },
          ]),
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: "35%",
      },
      {
        name: "Wins",
        type: "bar",
        data: winsData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `rgba(234,179,8,0.8)` },
            { offset: 1, color: `rgba(234,179,8,0.25)` },
          ]),
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: "25%",
      },
    ],
  };

  return (
    <Panel variant="elevated" className={classes.aggregateCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconUsers size={16} color="var(--mantine-color-gray-4)" />
          <Caption size="sm">Favored Factions</Caption>
        </Group>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 170, width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <table className={classes.dataTable}>
        <thead>
          <tr>
            <th>Faction</th>
            <th className={classes.alignRight}>Games</th>
            <th className={classes.alignRight}>Wins</th>
            <th className={classes.alignRight}>Win %</th>
          </tr>
        </thead>
        <tbody>
          {factions.map((f) => (
            <tr key={f.faction}>
              <td>
                <Group gap={6} wrap="nowrap">
                  <CircularFactionIcon faction={f.faction} size={14} />
                  <span className={classes.label}>{f.faction}</span>
                </Group>
              </td>
              <td className={classes.alignRight}>{f.gamesPlayed}</td>
              <td className={classes.alignRight}>{f.wins}</td>
              <td className={classes.alignRight}>
                {f.winPercent != null ? `${f.winPercent.toFixed(1)}%` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
