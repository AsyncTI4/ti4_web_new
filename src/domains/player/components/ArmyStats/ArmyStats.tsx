import { cdnImage } from "@/entities/data/cdnImage";
import { IconTrophy } from "@tabler/icons-react";
import cx from "clsx";
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

/** Rows carry only an icon, so the metric's name lives in the tooltip. */
const METRIC_LABEL: Record<Metric, string> = {
  resources: "Resource value",
  health: "Hit points",
  combat: "Combat strength",
};

function toTenths(value: number): { whole: string; fraction: string } {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [whole, fraction] = safe.toFixed(1).split(".");
  return { whole, fraction: `.${fraction}` };
}

function Figure({ value, className }: { value: number; className?: string }) {
  const { whole, fraction } = toTenths(value);

  return (
    <span className={cx(classes.number, className)}>
      {whole}
      <span className={classes.fraction}>{fraction}</span>
    </span>
  );
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
      <span
        className={cx(classes.gutter, classes.metricIcon, classes[metric])}
        role="img"
        aria-label={METRIC_LABEL[metric]}
        title={METRIC_LABEL[metric]}
      />
      <Figure value={ground} />
      <Figure value={space} className={classes.space} />
    </>
  );
}

const RANK_CLASS: Record<number, string> = {
  1: classes.rankFirst,
  2: classes.rankSecond,
  3: classes.rankThird,
};

function RankBadge({ rank }: { rank: number }) {
  return (
    <div
      className={cx(classes.rankBadge, RANK_CLASS[rank] ?? classes.rankOther)}
      title={`Rank ${rank} by army strength`}
    >
      <IconTrophy size={12} />
      <span className={classes.rankText}>{rank}</span>
    </div>
  );
}

export function ArmyStats({ stats, rank }: Props) {
  return (
    <div
      className={cx(classes.root, rank && classes.rootWithRank)}
      style={
        {
          "--army-res-icon": `url("${cdnImage("/player_area/pa_resources.png")}")`,
          "--army-health-icon": `url("${cdnImage("/player_area/pa_health.png")}")`,
          "--army-combat-icon": `url("${cdnImage("/player_area/pa_hit.png")}")`,
        } as CSSProperties
      }
    >
      <div className={classes.ledger}>
        <span className={classes.gutter} />
        <span className={classes.caption}>Ground</span>
        <span className={cx(classes.caption, classes.space)}>Space</span>
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
