import { Image } from "@/ds";
import { cdnImage } from "@/entities/data/cdnImage";
import { getActionCard } from "@/entities/lookup/actionCards";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import classes from "./PlanetAbilityDetailsCard.module.css";

type Props = {
  actionCards?: string[];
};

/** Action cards parked on a planet, grouped by alias with a count. */
export function PlanetActionCardsSection({ actionCards = [] }: Props) {
  if (actionCards.length === 0) return null;

  const counts = new Map<string, number>();
  for (const alias of actionCards) {
    counts.set(alias, (counts.get(alias) ?? 0) + 1);
  }

  return (
    <DetailsCard.Section
      title="Action cards"
      content={
        <div className={classes.cards}>
          {[...counts].map(([alias, count]) => {
            const cardLabel = getActionCard(alias)?.name ?? alias;
            return (
              <span key={alias} className={classes.cardRow}>
                <Image
                  src={cdnImage("/player_area/cardback_action.jpg")}
                  alt={`Action card ${cardLabel}`}
                  w={18}
                  h={12}
                />
                {cardLabel}
                {count > 1 && <b>×{count}</b>}
              </span>
            );
          })}
        </div>
      }
    />
  );
}
