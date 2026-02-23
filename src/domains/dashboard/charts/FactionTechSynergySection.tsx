import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { HeatmapChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Group, Text } from "@mantine/core";
import { IconAffiliate } from "@tabler/icons-react";
import type { FactionTechSynergy } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { AXIS_STYLE } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

type Props = { synergy: FactionTechSynergy };

export function FactionTechSynergySection({ synergy }: Props) {
  const factions = Object.keys(synergy.byFaction);
  const techSet = new Set<string>();
  for (const f of factions) {
    for (const t of Object.keys(synergy.byFaction[f].byTech)) {
      techSet.add(t);
    }
  }
  const techs = Array.from(techSet);

  if (factions.length === 0 || techs.length === 0) return null;

  const heatmapData: [number, number, number][] = [];
  for (let fi = 0; fi < factions.length; fi++) {
    const fEntry = synergy.byFaction[factions[fi]];
    for (let ti = 0; ti < techs.length; ti++) {
      const tEntry = fEntry.byTech[techs[ti]];
      heatmapData.push([ti, fi, tEntry ? tEntry.winRateWhenTech : -1]);
    }
  }

  const option: echarts.EChartsOption = {
    tooltip: {
      backgroundColor: "rgba(10,15,28,0.92)",
      borderColor: "rgba(148,163,184,0.15)",
      textStyle: { color: "#c0cbd8", fontFamily: "monospace", fontSize: 11 },
      formatter(params: unknown) {
        const p = params as { data: [number, number, number] };
        const [ti, fi, val] = p.data;
        const faction = factions[fi];
        const tech = techs[ti];
        if (val < 0) return `${faction} × ${tech}: no data`;
        const entry = synergy.byFaction[faction].byTech[tech];
        return [
          `<b>${faction}</b> × <b>${tech}</b>`,
          `Win rate: ${val.toFixed(1)}%`,
          `Games: ${entry?.gamesWithTech ?? 0}`,
          `Wins: ${entry?.winsWithTech ?? 0}`,
        ].join("<br/>");
      },
    },
    grid: { top: 6, left: 6, right: 56, bottom: 6, containLabel: true },
    xAxis: {
      type: "category",
      data: techs,
      ...AXIS_STYLE,
      axisLabel: { ...AXIS_STYLE.axisLabel, rotate: 30, fontSize: 8 },
      splitArea: { show: true, areaStyle: { color: ["rgba(0,0,0,0)", "rgba(148,163,184,0.02)"] } },
    },
    yAxis: {
      type: "category",
      data: factions,
      ...AXIS_STYLE,
      axisLabel: { ...AXIS_STYLE.axisLabel, fontSize: 9 },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: false,
      orient: "vertical",
      right: 0,
      top: "center",
      inRange: {
        color: [
          "rgba(148,163,184,0.06)",
          "rgba(147,51,234,0.2)",
          "rgba(249,115,22,0.4)",
          "rgba(234,179,8,0.6)",
          "rgba(34,197,94,0.75)",
        ],
      },
      textStyle: { color: "rgba(148,163,184,0.5)", fontSize: 9 },
      itemWidth: 10,
      itemHeight: 70,
    },
    series: [
      {
        type: "heatmap",
        data: heatmapData.filter(([, , v]) => v >= 0),
        label: {
          show: true,
          formatter: (p: { data: [number, number, number] }) => `${p.data[2].toFixed(0)}%`,
          color: "rgba(255,255,255,0.8)",
          fontSize: 10,
          fontFamily: "monospace",
        },
        itemStyle: { borderColor: "rgba(0,0,0,0.3)", borderWidth: 1 },
      },
    ],
  };

  return (
    <Panel variant="elevated" className={classes.aggregateCardFull}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconAffiliate size={16} color="var(--mantine-color-purple-4)" />
          <Caption size="sm">Faction–Tech Synergy</Caption>
        </Group>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: Math.max(140, factions.length * 36 + 30), width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <table className={classes.dataTable}>
        <thead>
          <tr>
            <th>Faction</th>
            <th className={classes.alignRight}>G</th>
            <th className={classes.alignRight}>W</th>
            {techs.map((t) => (
              <th key={t} className={classes.alignRight}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {factions.map((f) => {
            const entry = synergy.byFaction[f];
            return (
              <tr key={f}>
                <td className={classes.label}>{f}</td>
                <td className={classes.alignRight}>{entry.games}</td>
                <td className={classes.alignRight}>{entry.wins}</td>
                {techs.map((t) => {
                  const te = entry.byTech[t];
                  return (
                    <td key={t} className={classes.alignRight}>
                      {te ? `${te.winRateWhenTech.toFixed(0)}%` : "—"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
