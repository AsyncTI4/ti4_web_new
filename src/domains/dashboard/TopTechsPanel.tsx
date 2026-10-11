import { Tech } from "@/domains/player/components/Tech/Tech";
import type { PlayerAggregates, TechAggregateStat } from "./types";
import { DashBox } from "./DashboardParts";
import classes from "./DashboardPage.module.css";

const TOP_TECH_COUNT = 8;

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

export function TopTechsPanel({
  aggregates,
}: {
  aggregates: PlayerAggregates;
}) {
  const techs = topResearchedTechs(aggregates.techStats.byTech);
  if (techs.length === 0) return null;

  return (
    <DashBox
      label="Most researched"
      meta={`${aggregates.eligibleGameCount} games`}
    >
      <div className={classes.techs}>
        {techs.map(([techId, stat]) => (
          <div key={techId} className={classes.techRow}>
            <Tech techId={techId} />
            <span className={classes.techCount} title="Games with this tech">
              {stat.gamesWithTech}
            </span>
            <span className={classes.techPct} title="Share of eligible games">
              {stat.percentInEligibleGames.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </DashBox>
  );
}
