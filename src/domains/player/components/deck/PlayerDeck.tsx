import { useMemo } from "react";
import type { PlayerData } from "@/entities/data/types";
import { getFactionImage } from "@/entities/lookup/factions";
import { partitionGenericTechs } from "@/entities/lookup/tech";
import { getGameObjectiveColumnCount } from "@/domains/player/components/PlayerCardShared/ObjectivesRack";
import { getTechGridMobileColumnCount } from "@/domains/player/components/Tech/TechGridMobile";
import { PlayerDeckRow } from "./PlayerDeckRow";
import { LANES, getLaneLeader, type Lane } from "./deckLanes";
import styles from "./PlayerDeck.module.css";

type Props = {
  players: PlayerData[];
  vpsToWin: number;
};

/** A lane's engraved name, with the seat that leads it and by how much. */
function LaneHeader({ lane, players }: { lane: Lane; players: PlayerData[] }) {
  const leader = lane.key === "seat" ? undefined : getLaneLeader(lane, players);
  const leaderIcon = leader ? getFactionImage(leader.player.faction) : undefined;

  return (
    <div
      className={lane.key === "seat" ? `${styles.lh} ${styles.lhSeat}` : styles.lh}
      style={{ gridColumn: lane.column }}
    >
      <span className={styles.lhLabel}>{lane.name}</span>
      {leader && (
        <span
          className={styles.lhLead}
          title={`${leader.player.userName} leads in ${lane.leadLabel.toLowerCase()} · ${Math.floor(leader.value)}`}
        >
          {leaderIcon && <img src={leaderIcon} alt="" />}
          {Math.floor(leader.value)}
        </span>
      )}
    </div>
  );
}

/**
 * The player deck under the board: every seat is a row of one shared lane
 * grid, so stores, leaders, holdings, tech, units, economy and planets sit at
 * the same x for every player and each lane is as wide as its widest seat.
 */
export function PlayerDeck({ players, vpsToWin }: Props) {
  const objectiveColumns = useMemo(() => getGameObjectiveColumnCount(players), [players]);
  const techColumns = useMemo(
    () =>
      Math.max(
        1,
        ...players.map((player) =>
          getTechGridMobileColumnCount(partitionGenericTechs(player.techs ?? []).standardTechs),
        ),
      ),
    [players],
  );

  return (
    <section className={styles.wrap} aria-label="Player areas">
      <div className={styles.deckbar}>
        <span className={styles.deckTitle}>Player areas</span>
      </div>
      <div className={styles.deck}>
        <div className={styles.ruler}>
          {LANES.map((lane) => (
            <LaneHeader key={lane.key} lane={lane} players={players} />
          ))}
        </div>
        {players.map((player) => (
          <PlayerDeckRow
            key={player.color}
            player={player}
            objectiveColumns={objectiveColumns}
            techColumns={techColumns}
            vpsToWin={vpsToWin}
          />
        ))}
      </div>
    </section>
  );
}
