import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./OmenDice.module.css";

type Props = {
  dice?: number[];
};

/**
 * The Myko-Mentori Omen dice (Divination) resting by the faction sheet. The
 * bot's art has one card per face; a 10 is printed as 0.
 */
export function OmenDice({ dice }: Props) {
  if (!dice || dice.length === 0) return null;

  return (
    <div className={styles.row} aria-label="Omen dice">
      {dice.map((value, index) => (
        <img
          key={`${index}-${value}`}
          className={styles.die}
          src={cdnImage(`/player_area/pa_ds_myko_omen_${value % 10}.png`)}
          alt={`Omen die: ${value}`}
          title={`Omen die: ${value}`}
          draggable={false}
        />
      ))}
    </div>
  );
}
