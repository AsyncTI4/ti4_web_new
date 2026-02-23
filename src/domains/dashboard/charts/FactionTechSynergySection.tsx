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
import type { FactionTechSynergy, FactionTechSynergyStat } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { AXIS_STYLE } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

const MIN_FACTION_GAMES = 2;
const MIN_FACTIONS_PER_TECH = 2;
const MAX_FACTIONS = 10;
const MAX_TECHS = 12;

/** Exclude techs from specific packs/prefixes */
function isExcludedTech(techId: string): boolean {
  return techId.startsWith("tf-");
}

/** Standard deviation of an array of numbers */
function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

type FilteredData = {
  factions: string[];
  techs: string[];
};

/**
 * Filters the synergy data to only interesting faction-tech combos:
 * 1. Factions with >= MIN_FACTION_GAMES games
 * 2. Techs appearing in >= MIN_FACTIONS_PER_TECH factions (with actual games)
 * 3. Ranked by win-rate variance (std dev) — keeps only the most differentiating techs
 * 4. Capped at MAX_FACTIONS and MAX_TECHS
 */
function filterSynergyData(synergy: FactionTechSynergy): FilteredData {
  // Step 1: filter factions by minimum games, sort by games desc
  const qualifiedFactions = Object.entries(synergy.byFaction)
    .filter(([, entry]) => entry.games >= MIN_FACTION_GAMES)
    .sort((a, b) => b[1].games - a[1].games)
    .slice(0, MAX_FACTIONS)
    .map(([name]) => name);

  if (qualifiedFactions.length === 0) return { factions: [], techs: [] };

  // Step 2: collect all techs across qualified factions, excluding banned ones
  const techFactionCounts = new Map<string, number>();
  const techWinRates = new Map<string, number[]>();

  for (const f of qualifiedFactions) {
    const fEntry = synergy.byFaction[f];
    for (const [techId, tStat] of Object.entries(fEntry.byTech)) {
      if (isExcludedTech(techId)) continue;
      if (tStat.gamesWithTech === 0) continue;

      techFactionCounts.set(techId, (techFactionCounts.get(techId) ?? 0) + 1);
      const rates = techWinRates.get(techId) ?? [];
      rates.push(tStat.winRateWhenTech);
      techWinRates.set(techId, rates);
    }
  }

  // Step 3: filter techs that appear in enough factions, rank by variance
  const techScores: { id: string; score: number }[] = [];
  for (const [techId, count] of techFactionCounts) {
    if (count < MIN_FACTIONS_PER_TECH) continue;
    const rates = techWinRates.get(techId) ?? [];
    techScores.push({ id: techId, score: stdDev(rates) });
  }

  // Sort by variance descending — most differentiating techs first
  techScores.sort((a, b) => b.score - a.score);
  const qualifiedTechs = techScores.slice(0, MAX_TECHS).map((t) => t.id);

  return { factions: qualifiedFactions, techs: qualifiedTechs };
}

type Props = { synergy: FactionTechSynergy };

export function FactionTechSynergySection({ synergy }: Props) {
  const { factions, techs } = filterSynergyData(synergy);

  if (factions.length === 0 || techs.length === 0) return null;

  const heatmapData: [number, number, number][] = [];
  for (let fi = 0; fi < factions.length; fi++) {
    const fEntry = synergy.byFaction[factions[fi]];
    for (let ti = 0; ti < techs.length; ti++) {
      const tEntry = fEntry.byTech[techs[ti]];
      heatmapData.push([ti, fi, tEntry && tEntry.gamesWithTech > 0 ? tEntry.winRateWhenTech : -1]);
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
      axisLabel: { ...AXIS_STYLE.axisLabel, rotate: 35, fontSize: 9 },
      splitArea: { show: true, areaStyle: { color: ["rgba(0,0,0,0)", "rgba(148,163,184,0.02)"] } },
    },
    yAxis: {
      type: "category",
      data: factions,
      ...AXIS_STYLE,
      axisLabel: { ...AXIS_STYLE.axisLabel, fontSize: 10 },
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
        <Text size="10px" c="gray.6">
          Top {factions.length} factions · {techs.length} most differentiating techs
        </Text>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: Math.max(160, factions.length * 36 + 40), width: "100%" }}
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
                  const hasData = te && te.gamesWithTech > 0;
                  return (
                    <td key={t} className={classes.alignRight}>
                      {hasData ? `${te.winRateWhenTech.toFixed(0)}%` : "—"}
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
