import { PdsControlToken } from "../PdsControlToken";
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/entities/geometry/tilePositioning";
import { getColorAlias } from "@/entities/lookup/colors";
import type { GameData } from "@/entities/game/types";
import styles from "./PdsOverlayLayer.module.css";

type Props = {
  ringPosition: string;
  pdsByTile?: GameData["pdsByTile"] | null;
};

export function PdsOverlayLayer({ ringPosition, pdsByTile }: Props) {
  const all = pdsByTile?.[ringPosition];
  if (!all?.length) return null;

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
        {all.map((entry) => (
          <div
            key={`${ringPosition}-${entry.faction}`}
            className={styles.gridItem}
          >
            <PdsControlToken
              colorAlias={getColorAlias(entry.color)}
              faction={entry.faction}
              count={entry.count}
              expected={entry.expected}
              style={{ width: 80, height: 80 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
