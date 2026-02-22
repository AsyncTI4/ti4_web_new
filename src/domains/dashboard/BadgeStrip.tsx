import { Group, Stack } from "@mantine/core";
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
import classes from "./BadgeStrip.module.css";

const BADGE_ICONS: Record<string, React.ComponentType<{ size: number }>> = {
  fleet_logistics: IconBolt,
  from_the_brink: IconFlame,
  galactic_endurance: IconHourglass,
  speakers_hand: IconMessages,
  twilight_strategist: IconMoon,
  galactic_metamorph: IconShape,
};

const BADGE_METRIC_LABELS: Record<string, { unit: string; flavor: string }> = {
  fleet_logistics: {
    unit: "turns taken",
    flavor: "Rapid operational tempo",
  },
  from_the_brink: {
    unit: "clutch finishes",
    flavor: "Wins at match point",
  },
  galactic_endurance: {
    unit: "marathon games finished",
    flavor: "Campaigns over 180 days",
  },
  speakers_hand: {
    unit: "diplomacy titles earned",
    flavor: "Table influence broker",
  },
  twilight_strategist: {
    unit: "late-night sessions",
    flavor: "Active in twilight hours",
  },
  galactic_metamorph: {
    unit: "unique faction wins",
    flavor: "Adapts across identities",
  },
};

function badgeColorClass(key: string) {
  const safe = key.replace(/-/g, "_");
  return classes[`badge_${safe}` as keyof typeof classes] ?? "";
}

function tierClasses(tier: BadgeAward["tier"]) {
  switch (tier) {
    case "GOLD":
      return { label: classes.tierGold, pip: classes.tierPipGold, card: classes.tierGoldCard };
    case "LEGENDARY":
      return { label: classes.tierLegendary, pip: classes.tierPipLegendary, card: classes.tierLegendaryCard };
    default:
      return { label: classes.tierSilver, pip: classes.tierPipSilver, card: undefined };
  }
}

function scorePercent(badge: BadgeAward) {
  if (badge.threshold == null || badge.threshold === 0 || badge.score == null) return 100;
  return Math.min(100, (badge.score / badge.threshold) * 100);
}

function isOverThreshold(badge: BadgeAward) {
  if (badge.threshold == null || badge.score == null) return false;
  return badge.score > badge.threshold;
}

type Props = {
  badges: BadgeAward[];
};

export function BadgeStrip({ badges }: Props) {
  if (badges.length === 0) return null;

  return (
    <div className={classes.strip}>
      {badges.map((badge) => {
        const Icon = BADGE_ICONS[badge.key] ?? IconBolt;
        const tier = tierClasses(badge.tier);
        const meta = BADGE_METRIC_LABELS[badge.key];
        const overflow = isOverThreshold(badge);

        return (
          <div
            key={badge.key}
            className={cx(classes.badge, badgeColorClass(badge.key), tier.card)}
          >
            <div className={classes.cornerAccent} />
            <div className={classes.shimmer} />

            <Stack gap={7}>
              <Group gap={10} wrap="nowrap" align="flex-start">
                <div className={classes.iconWrap}>
                  <Icon size={18} />
                </div>
                <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                  <div className={classes.badgeName}>{badge.name}</div>
                  <span className={cx(classes.tier, tier.label)}>
                    <span className={cx(classes.tierPip, tier.pip)} />
                    {badge.tier}
                  </span>
                </Stack>
              </Group>

              {badge.score != null && meta && (
                <div className={classes.metric}>
                  <span className={classes.metricValue}>{badge.score}</span>
                  <span className={classes.metricLabel}>{meta.unit}</span>
                  {badge.threshold != null && (
                    <span className={classes.metricThreshold}>
                      / {badge.threshold} req
                    </span>
                  )}
                </div>
              )}

              {meta && <div className={classes.badgeDesc}>{meta.flavor}</div>}

              <div className={cx(classes.scoreBar, overflow && classes.scoreOverflow)}>
                <div
                  className={classes.scoreFill}
                  style={{ width: `${scorePercent(badge)}%` }}
                />
              </div>
            </Stack>
          </div>
        );
      })}
    </div>
  );
}
