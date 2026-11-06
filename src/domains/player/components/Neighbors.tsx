import { IconUsers } from "@tabler/icons-react";
import { useOriginalFactionColors } from "@/hooks/useFactionColors";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import styles from "./RailParts.module.css";

type Props = {
  neighbors: string[];
};

/** The factions this player borders, keyed by a quiet neighbours glyph. */
export function Neighbors({ neighbors }: Props) {
  const factionColorMap = useOriginalFactionColors();
  const neighborFactions = neighbors
    .map((neighborColor) => factionColorMap[neighborColor]?.faction)
    .filter((faction): faction is string => Boolean(faction));

  if (neighborFactions.length === 0) return null;

  return (
    <span
      className={styles.nbrs}
      title={`Neighbours: ${neighborFactions.join(", ")}`}
    >
      <IconUsers size={14} stroke={1.6} aria-label="Neighbours" />
      {neighborFactions.map((faction) => (
        <FactionIcon key={faction} faction={faction} alt={faction} fit="contain" />
      ))}
    </span>
  );
}
