import type { ComponentType } from "react";
import {
  IconBolt,
  IconFlame,
  IconHourglass,
  IconMessages,
  IconMoon,
  IconShape,
} from "@tabler/icons-react";
import cx from "clsx";
import type { BadgeAward } from "./types";
import { DashBox } from "./DashboardParts";
import classes from "./BadgeStrip.module.css";

const BADGE_ICONS: Record<string, ComponentType<{ size: number }>> = {
  fleet_logistics: IconBolt,
  from_the_brink: IconFlame,
  galactic_endurance: IconHourglass,
  speakers_hand: IconMessages,
  twilight_strategist: IconMoon,
  galactic_metamorph: IconShape,
};

const TIER_CLASS: Record<BadgeAward["tier"], string | undefined> = {
  SILVER: undefined,
  GOLD: classes.gold,
  LEGENDARY: classes.legendary,
};

const TIER_LABEL: Record<BadgeAward["tier"], string> = {
  SILVER: "Silver",
  GOLD: "Gold",
  LEGENDARY: "Legendary",
};

function formatMetric(value: number, unit: string) {
  if (unit === "seconds") {
    if (value < 60) return `${Math.round(value)}s`;
    if (value < 3600) return `${Math.round(value / 60)}m`;
    return `${(value / 3600).toFixed(1)}h`;
  }
  if (unit === "ratio") return `${(value * 100).toFixed(1)}%`;
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(2);
}

function requirementPercent(current: number, target: number) {
  if (target <= 0) return 100;
  return Math.min(100, (current / target) * 100);
}

function Badge({ badge }: { badge: BadgeAward }) {
  const Icon = BADGE_ICONS[badge.key.replace(/-/g, "_")] ?? IconBolt;
  const primary = badge.primaryMetric;

  return (
    <article className={cx(classes.badge, TIER_CLASS[badge.tier])}>
      <div className={classes.head}>
        <span className={classes.well}>
          <Icon size={15} />
        </span>
        <span>
          <div className={classes.name} title={badge.name}>
            {badge.name}
          </div>
          <span className={classes.tier}>{TIER_LABEL[badge.tier] ?? badge.tier}</span>
        </span>
      </div>

      {primary && (
        <div className={classes.metric}>
          <span className={classes.metricValue}>
            {formatMetric(primary.value, primary.unit)}
          </span>
          <span className={classes.metricLabel}>{primary.label}</span>
        </div>
      )}

      <div className={classes.reqs}>
        {badge.requirements.map((req, index) => (
          <div
            key={`${badge.key}-${index}`}
            className={classes.req}
            data-met={req.met || undefined}
          >
            <span title={req.label}>{req.label}</span>
            <span className={classes.reqValue}>
              {formatMetric(req.current, req.unit)} / {formatMetric(req.target, req.unit)}
            </span>
            <span className={classes.bar} aria-hidden="true">
              <i style={{ width: `${requirementPercent(req.current, req.target)}%` }} />
            </span>
          </div>
        ))}
      </div>

      <div className={classes.desc}>{badge.summary}</div>
      <div className={classes.desc}>{badge.tierRuleText}</div>
    </article>
  );
}

export function BadgeStrip({ badges }: { badges: BadgeAward[] }) {
  if (badges.length === 0) return null;

  return (
    <DashBox label="Badges" meta={badges.length}>
      <div className={classes.strip}>
        {badges.map((badge) => (
          <Badge key={badge.key} badge={badge} />
        ))}
      </div>
    </DashBox>
  );
}
