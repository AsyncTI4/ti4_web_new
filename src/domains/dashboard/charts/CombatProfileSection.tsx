import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { RadarChart } from "echarts/charts";
import {
  RadarComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Group, Text } from "@mantine/core";
import { IconSword } from "@tabler/icons-react";
import type { CombatProfile } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import { Chip } from "@/shared/ui/primitives/Chip";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { CHART_COLORS } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([RadarChart, RadarComponent, TooltipComponent, CanvasRenderer]);

const COMBAT_LABELS: Record<string, string> = {
  combatsInitiated: "Combats",
  tacticalsWithCombat: "Engagements",
  planetsTaken: "Planets Taken",
  planetsStolen: "Planets Stolen",
  diceRolled: "Dice Rolled",
};

const COMBAT_KEYS = Object.keys(COMBAT_LABELS) as (keyof typeof COMBAT_LABELS)[];

type Props = { profile: CombatProfile };

export function CombatProfileSection({ profile }: Props) {
  const avgs = profile.averagesPerCompletedGame;
  const totals = profile.totals;

  const maxVals = {
    combatsInitiated: 10,
    tacticalsWithCombat: 8,
    planetsTaken: 6,
    planetsStolen: 2,
    diceRolled: 200,
  };

  const radarData = COMBAT_KEYS.map((k) => {
    const max = maxVals[k as keyof typeof maxVals] ?? 10;
    return Math.min(100, (avgs[k as keyof typeof avgs] / max) * 100);
  });

  const option: echarts.EChartsOption = {
    tooltip: {
      backgroundColor: "rgba(10,15,28,0.92)",
      borderColor: "rgba(148,163,184,0.15)",
      textStyle: { color: "#c0cbd8", fontFamily: "monospace", fontSize: 11 },
    },
    radar: {
      indicator: COMBAT_KEYS.map((k) => ({
        name: COMBAT_LABELS[k],
        max: 100,
      })),
      shape: "polygon",
      radius: "65%",
      axisName: {
        color: "rgba(148,163,184,0.6)",
        fontSize: 9,
        fontFamily: "monospace",
      },
      splitArea: { areaStyle: { color: ["rgba(239,68,68,0.02)", "rgba(239,68,68,0.04)"] } },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.08)" } },
      axisLine: { lineStyle: { color: "rgba(148,163,184,0.1)" } },
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: radarData,
            name: "Per-Game Avg",
            areaStyle: { color: `rgba(249,115,22,0.12)` },
            lineStyle: { color: CHART_COLORS.orange, width: 2 },
            itemStyle: { color: CHART_COLORS.orange },
            symbol: "circle",
            symbolSize: 4,
          },
        ],
      },
    ],
  };

  return (
    <Panel variant="elevated" className={classes.aggregateCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconSword size={16} color="var(--mantine-color-orange-4)" />
          <Caption size="sm">Combat Profile</Caption>
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
          style={{ height: 190, width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <div className={classes.combatStatGrid}>
        {COMBAT_KEYS.map((k) => (
          <div key={k} className={classes.combatStatItem}>
            <Caption size="xs">{COMBAT_LABELS[k]}</Caption>
            <span className={classes.combatStatValue}>
              {totals[k as keyof typeof totals].toLocaleString()}
            </span>
            <span className={classes.combatStatAvg}>
              {avgs[k as keyof typeof avgs].toFixed(1)}/game
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
