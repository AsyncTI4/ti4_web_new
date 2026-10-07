import { useFactionTokenImage } from "@/hooks/useFactionTokenImage";
import classes from "./PlanetOwnerBadge.module.css";

type Props = {
  faction: string;
  x: number;
  y: number;
};

export function PlanetOwnerBadge({ faction, x, y }: Props) {
  const factionIcon = useFactionTokenImage(faction);
  if (!factionIcon) return null;

  return (
    <span
      title={`${faction} controls this planet`}
      className={classes.badge}
      style={{ left: x + 40, top: y + 36 }}
    >
      <img src={factionIcon} alt={`${faction} faction`} className={classes.icon} />
    </span>
  );
}
