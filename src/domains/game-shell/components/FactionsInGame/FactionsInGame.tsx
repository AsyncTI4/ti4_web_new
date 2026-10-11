import { Box } from "@/ds";
import type { PlayerData } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { seatColorStyle } from "./seatColor";
import { filterPlayersWithAssignedFaction } from "@/entities/game/playerUtils";
import styles from "./FactionsInGame.module.css";

type Props = {
  playerData: PlayerData[];
};

function byInitiative(a: PlayerData, b: PlayerData) {
  const minScA = a.scs.length > 0 ? Math.min(...a.scs) : Infinity;
  const minScB = b.scs.length > 0 ? Math.min(...b.scs) : Infinity;
  return minScA - minScB;
}

/** Seats in turn order (by initiative) with VP, and ACTIVE / NEXT tags. */
function FactionsInGame({ playerData }: Props) {
  const seats = [...filterPlayersWithAssignedFaction(playerData)].sort(byInitiative);
  const activeIndex = seats.findIndex((player) => player.active);
  const nextIndex = activeIndex >= 0 ? (activeIndex + 1) % seats.length : -1;

  return (
    <Box className={styles.ring}>
      {seats.map((player, index) => {
        const tag = player.active ? "active" : index === nextIndex ? "next" : null;
        const initiative = player.scs.length > 0 ? Math.min(...player.scs) : null;
        return (
          <Box
            key={player.faction}
            className={styles.seat}
            style={seatColorStyle(player.color)}
            data-passed={player.passed || undefined}
            title={`${player.userName} · ${player.faction}${initiative ? ` · initiative ${initiative}` : ""}${player.passed ? " · passed" : ""}`}
          >
            {tag && (
              <span className={styles.tag} data-tag={tag}>
                {tag}
              </span>
            )}
            <FactionIcon
              faction={player.faction}
              factionImageOverride={player.factionImage}
              factionImageTypeOverride={player.factionImageType}
              alt={player.faction}
              w={26}
              h={26}
            />
            <b className={styles.vp}>{player.totalVps}</b>
            <span className={styles.name}>{player.userName}</span>
          </Box>
        );
      })}
    </Box>
  );
}

export default FactionsInGame;
