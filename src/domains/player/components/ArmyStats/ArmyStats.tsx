import { cdnImage } from "@/entities/data/cdnImage";
import { IconTrophy } from "@tabler/icons-react";
import type { CSSProperties } from "react";
import classes from "./ArmyStats.module.css";

type ArmyStatsData = {
  spaceArmyRes: number;
  groundArmyRes: number;
  spaceArmyHealth: number;
  groundArmyHealth: number;
  spaceArmyCombat: number;
  groundArmyCombat: number;
};

type Props = {
  stats: ArmyStatsData;
  rank?: number;
};

type Metric = "resources" | "health" | "combat";

function formatOneDecimal(value: number): string {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "0.0";
  }
  return Number(value).toFixed(1);
}

function MetricRow({
  metric,
  ground,
  space,
}: {
  metric: Metric;
  ground: number;
  space: number;
}) {
  return (
    <>
      <span className={`${classes.metricIcon} ${classes[metric]}`} />
      <span className={classes.number}>{formatOneDecimal(ground)}</span>
      <span className={classes.number}>{formatOneDecimal(space)}</span>
    </>
  );
}

const RANK_CONFIG = {
  1: {
    color: "var(--army-rank-first-color)",
    bg: "rgba(255, 215, 0, 0.12)",
    border: "rgba(255, 215, 0, 0.3)",
  },
  2: {
    color: "var(--army-rank-second-color)",
    bg: "rgba(192, 192, 192, 0.12)",
    border: "rgba(192, 192, 192, 0.3)",
  },
  3: {
    color: "var(--army-rank-third-color)",
    bg: "rgba(205, 127, 50, 0.12)",
    border: "rgba(205, 127, 50, 0.3)",
  },
  default: {
    color: "rgba(180, 180, 180, 0.9)",
    bg: "rgba(20, 20, 20, 0.4)",
    border: "rgba(80, 80, 80, 0.3)",
  },
} as const;

function RankBadge({ rank }: { rank: number }) {
  const config =
    rank <= 3 ? RANK_CONFIG[rank as 1 | 2 | 3] : RANK_CONFIG.default;

  return (
    <div
      className={classes.rankBadge}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      <IconTrophy size={12} style={{ color: config.color }} />
      <span className={classes.rankText} style={{ color: config.color }}>
        {rank}
      </span>
    </div>
  );
}

export function ArmyStats({ stats, rank }: Props) {
  return (
    <div
      className={rank ? classes.withRankFooter : undefined}
      style={
        {
          "--army-res-icon": `url("${cdnImage("/player_area/pa_resources.png")}")`,
          "--army-health-icon": `url("${cdnImage("/player_area/pa_health.png")}")`,
          "--army-combat-icon": `url("${cdnImage("/player_area/pa_hit.png")}")`,
        } as CSSProperties
      }
    >
      <div className={classes.grid}>
        <span />
        <span className={classes.caption}>GROUND</span>
        <span className={classes.caption}>SPACE</span>
        <MetricRow
          metric="resources"
          ground={stats.groundArmyRes}
          space={stats.spaceArmyRes}
        />
        <MetricRow
          metric="health"
          ground={stats.groundArmyHealth}
          space={stats.spaceArmyHealth}
        />
        <MetricRow
          metric="combat"
          ground={stats.groundArmyCombat}
          space={stats.spaceArmyCombat}
        />
      </div>
      {rank && <RankBadge rank={rank} />}
    </div>
  );
}
