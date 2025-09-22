import { PdsControlToken } from "../PdsControlToken";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import { getColorAlias } from "@/lookup/colors";
import styles from "./PdsOverlayLayer.module.css";

type Props = {
  ringPosition: string;
  dominantPdsFaction?: Record<
    string,
    | { color: string; faction: string; count: number; expected: number }
    | undefined
  > | null;
  pdsByTile?: Record<
    string,
    { faction: string; color: string; count: number; expected: number }[]
  > | null;
};

export function PdsOverlayLayer({
  ringPosition,
  dominantPdsFaction,
  pdsByTile,
}: Props) {
  if (!ringPosition || !pdsByTile) return null;
  const all = pdsByTile[ringPosition];
  if (!all || all.length === 0) return null;

  const dominant = dominantPdsFaction?.[ringPosition];

  return (
    <div
      className={styles.wrapper}
      style={{
        position: "absolute",
        left: `${TILE_WIDTH / 2}px`,
        top: `${TILE_HEIGHT / 2}px`,
        transform: "translate(-50%, -50%)",
        zIndex: "var(--z-pds-overlay)",
      }}
    >
      <div className={styles.grid}>
        {all.map((entry) => {
          const isDominant = dominant && entry.faction === dominant.faction;
          return (
            <PdsControlToken
              key={`${ringPosition}-${entry.faction}`}
              colorAlias={getColorAlias(entry.color)}
              faction={entry.faction}
              count={entry.count}
              expected={entry.expected}
              style={{
                width: isDominant ? 80 : 56,
                height: isDominant ? 80 : 56,
              }}
              dominant={!!isDominant}
              compact={!isDominant}
            />
          );
        })}
      </div>
    </div>
  );
}
