import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { HeatmapChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { FactionTechSynergy } from "../types";
import { DashBox } from "../DashboardParts";
import { useChartTheme } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

const MIN_FACTION_GAMES = 2;
const MIN_FACTIONS_PER_TECH = 2;
const MAX_FACTIONS = 10;
const MAX_TECHS = 12;

function isExcludedTech(techId: string): boolean {
  return techId.startsWith("tf-");
}

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
  const qualifiedFactions = Object.entries(synergy.byFaction)
    .filter(([, entry]) => entry.games >= MIN_FACTION_GAMES)
    .sort((a, b) => b[1].games - a[1].games)
    .slice(0, MAX_FACTIONS)
    .map(([name]) => name);

  if (qualifiedFactions.length === 0) return { factions: [], techs: [] };

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

  const techScores: { id: string; score: number }[] = [];
  for (const [techId, count] of techFactionCounts) {
    if (count < MIN_FACTIONS_PER_TECH) continue;
    const rates = techWinRates.get(techId) ?? [];
    techScores.push({ id: techId, score: stdDev(rates) });
  }

  techScores.sort((a, b) => b.score - a.score);
  const qualifiedTechs = techScores.slice(0, MAX_TECHS).map((t) => t.id);

  return { factions: qualifiedFactions, techs: qualifiedTechs };
}

type Props = { synergy: FactionTechSynergy };

export function FactionTechSynergySection({ synergy }: Props) {
  const theme = useChartTheme();
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

  const option: echarts.EChartsCoreOption = {
    tooltip: {
      ...theme.tooltip,
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
      ...theme.axis,
      axisLabel: { ...theme.axis.axisLabel, rotate: 35, fontSize: 9 },
    },
    yAxis: {
      type: "category",
      data: factions,
      ...theme.axis,
      axisLabel: { ...theme.axis.axisLabel, fontSize: 10 },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: false,
      orient: "vertical",
      right: 0,
      top: "center",
      inRange: {
        color: [theme.sig("ok", 0.06), theme.sig("ok", 0.3), theme.sig("ok", 0.7)],
      },
      textStyle: { color: theme.inkLo, fontFamily: theme.font, fontSize: 9 },
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
          color: theme.inkHi,
          fontSize: 10,
          fontFamily: theme.font,
        },
        itemStyle: { borderColor: theme.hair(0.1), borderWidth: 1 },
      },
    ],
  };

  return (
    <DashBox
      className={classes.full}
      label="Win rate by faction and tech"
      meta={`${factions.length} factions · ${techs.length} techs`}
    >
      <span className={classes.note}>
        Your win rate in games where you held each tech, for the techs that
        separate your factions the most.
      </span>
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: Math.max(160, factions.length * 36 + 40), width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <div className={classes.tableWrap}>
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
                <td className={classes.cellText}>{f}</td>
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
      </div>
    </DashBox>
  );
}
