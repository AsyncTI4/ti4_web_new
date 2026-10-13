import { cdnImage } from "@/entities/data/cdnImage";
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

function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
}

/**
 * The podium gets a struck medal; everyone else gets their place as a plain
 * ordinal. The wording lives in the tooltip.
 */
function RankBadge({ rank }: { rank: number }) {
  const medal = RANK_CLASS[rank];
  const fullLabel = rank === 1 ? "Strongest army" : `${ordinal(rank)} strongest army`;

  return (
    <div
      className={cx(classes.rankBadge, medal ?? classes.rankOther)}
      title={fullLabel}
      aria-label={fullLabel}
    >
      {medal ? (
        <span className={classes.medal} aria-hidden="true">
          {rank}
        </span>
      ) : (
        <span className={classes.rankText} aria-hidden="true">
          {ordinal(rank)}
        </span>
      )}
    </div>
  );
}

export function ArmyStats({ stats, rank }: Props) {
  return (
    <div
      className={classes.root}
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
