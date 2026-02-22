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
        const primary = badge.primaryMetric;
        const firstRequirement = badge.requirements[0];

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

              {primary && (
                <div className={classes.metric}>
                  <span className={classes.metricValue}>
                    {formatMetric(primary.value, primary.unit)}
                  </span>
                  <span className={classes.metricLabel}>{primary.label}</span>
                </div>
              )}

              <Stack gap={2}>
                {badge.requirements.map((req, idx) => (
                  <div
                    key={`${badge.key}-${idx}`}
                    className={classes.badgeDesc}
                    style={{ color: req.met ? "var(--mantine-color-green-4)" : "var(--mantine-color-gray-5)" }}
                  >
                    {req.label}: {formatMetric(req.current, req.unit)} / {formatMetric(req.target, req.unit)}
                  </div>
                ))}
              </Stack>

              <div className={classes.badgeDesc}>{badge.summary}</div>
              <div className={classes.badgeDesc}>{badge.tierRuleText}</div>

              <div className={classes.scoreBar}>
                <div
                  className={classes.scoreFill}
                  style={{
                    width: firstRequirement
                      ? `${requirementPercent(firstRequirement.current, firstRequirement.target)}%`
                      : "100%",
                  }}
                />
              </div>
            </Stack>
          </div>
        );
      })}
    </div>
  );
}
