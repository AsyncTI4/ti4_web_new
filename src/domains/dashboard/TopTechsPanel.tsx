import { IconCrosshair } from "@tabler/icons-react";
import cx from "clsx";
import { Panel } from "@/shared/ui/primitives/Panel";
import { getTechData } from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { cdnImage } from "@/entities/data/cdnImage";
import type { PlayerAggregates, TechAggregateStat } from "./types";
import { SectionHeader } from "./DashboardParts";
import { gameCountLabel } from "./dashboardFormat";
import classes from "./DashboardPage.module.css";

const TOP_TECH_COUNT = 8;

const TECH_TYPE_COLORS: Record<string, string> = {
  BIOTIC: classes.techBiotic,
  PROPULSION: classes.techPropulsion,
  CYBERNETIC: classes.techCybernetic,
  WARFARE: classes.techWarfare,
  UNITUPGRADE: classes.techUnitUpgrade,
};

function getUnitImageUrl(
  techId: string,
  baseUpgrade?: string,
): string | undefined {
  const unitData = getGenericUnitDataByRequiredTechId(baseUpgrade || techId);
  if (!unitData?.asyncId) return undefined;
  return cdnImage(`/units/lgy_${unitData.asyncId}.png`);
}

/** Most games first, then highest share of eligible games. */
function topResearchedTechs(
  byTech: Record<string, TechAggregateStat>,
): [string, TechAggregateStat][] {
  return Object.entries(byTech)
    .sort(
      ([, a], [, b]) =>
        b.gamesWithTech - a.gamesWithTech ||
        b.percentInEligibleGames - a.percentInEligibleGames,
    )
    .slice(0, TOP_TECH_COUNT);
}

function TechTopItem({
  techId,
  stat,
}: {
  techId: string;
  stat: TechAggregateStat;
}) {
  const tech = getTechData(techId);
  const techName = tech?.name ?? techId;
  const unitImg = tech?.types.includes("UNITUPGRADE")
    ? getUnitImageUrl(techId, tech.baseUpgrade)
    : undefined;

  return (
    <div
      className={cx(
        classes.techTopItem,
        TECH_TYPE_COLORS[tech?.types[0] ?? ""],
      )}
    >
      <div className={classes.techTopHeader}>
        {unitImg ? (
          <img src={unitImg} alt={techName} className={classes.techUnitIcon} />
        ) : (
          <span className={classes.techTypePip} />
        )}
        <span className={classes.techName} title={techName}>
          {techName}
        </span>
      </div>
      <div className={classes.techTopMeta}>
        <span className={classes.techGames}>
          {gameCountLabel(stat.gamesWithTech)}
        </span>
        <span className={classes.techPercent}>
          {stat.percentInEligibleGames.toFixed(1)}%
        </span>
      </div>
      <div className={classes.techBar}>
        <div
          className={classes.techBarFill}
          style={{ width: `${Math.min(100, stat.percentInEligibleGames)}%` }}
        />
      </div>
    </div>
  );
}

export function TopTechsPanel({
  aggregates,
}: {
  aggregates: PlayerAggregates;
}) {
  const techs = topResearchedTechs(aggregates.techStats.byTech);
  if (techs.length === 0) return null;

  return (
    <Panel variant="elevated" className={classes.sectionCard}>
      <SectionHeader
        icon={<IconCrosshair size={16} color="var(--mantine-color-blue-4)" />}
        title="Top Researched Techs"
        badgeAccent="blue"
        badge={`${aggregates.eligibleGameCount} Eligible`}
      />
      <div className={classes.techTopGrid}>
        {techs.map(([techId, stat]) => (
          <TechTopItem key={techId} techId={techId} stat={stat} />
        ))}
      </div>
    </Panel>
  );
}
