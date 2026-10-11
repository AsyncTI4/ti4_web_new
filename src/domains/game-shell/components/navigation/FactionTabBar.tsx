import { Box, UnstyledButton } from "@/ds";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import classes from "./FactionTabBar.module.css";
import type { AreaType } from "@/hooks/useTabsAndTooltips";
import type { PlayerData } from "@/entities/data/types";
import { filterPlayersWithAssignedFaction } from "@/entities/game/playerUtils";
import { seatColorStyle } from "@/domains/game-shell/components/FactionsInGame/seatColor";

type FactionTabBarProps = {
  playerData: PlayerData[];
  selectedArea: AreaType;
  activeArea: AreaType;
  /** The seat the dossier is showing (pinned, peeked or the default). */
  shownFaction?: string | null;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
};

function seatTitle(player: PlayerData, key: number) {
  const status = player.active ? " · active" : player.passed ? " · passed" : "";
  return `${player.userName} · ${player.faction} · ${player.totalVps} VP${status} (key ${key})`;
}

/**
 * Seat tabs: colour band, faction, VP, an active or passed light, and the
 * number key that pins the seat. Hover peeks, click pins.
 */
export function FactionTabBar({
  playerData,
  selectedArea,
  activeArea,
  shownFaction,
  onAreaSelect,
  onAreaMouseEnter,
  onAreaMouseLeave,
}: FactionTabBarProps) {
  const seats = filterPlayersWithAssignedFaction(playerData);

  return (
    <Box
      className={classes.factionTabBar}
      role="tablist"
      aria-label="Seats"
      style={{ "--seats": seats.length } as React.CSSProperties}
    >
      {seats.map((player) => {
        const key = playerData.indexOf(player) + 1;
        const isHovered =
          activeArea?.type === "faction" && activeArea.faction === player.faction;
        const isPinned =
          selectedArea?.type === "faction" && selectedArea.faction === player.faction;
        const area: AreaType = {
          type: "faction",
          faction: player.faction,
          coords: { x: 0, y: 0 },
        };
        const light = player.active ? "active" : player.passed ? "passed" : undefined;

        return (
          <UnstyledButton
            key={player.color}
            role="tab"
            aria-selected={shownFaction === player.faction}
            data-pinned={isPinned || undefined}
            data-hover={isHovered || undefined}
            className={classes.tab}
            style={seatColorStyle(player.color)}
            title={seatTitle(player, key)}
            onClick={() => onAreaSelect(area)}
            onMouseEnter={() => onAreaMouseEnter(area)}
            onMouseLeave={onAreaMouseLeave}
          >
            {key <= 8 && <kbd className={classes.kbd}>{key}</kbd>}
            {light && <span className={classes.light} data-light={light} />}
            <FactionIcon
              faction={player.faction}
              factionImageOverride={player.factionImage}
              factionImageTypeOverride={player.factionImageType}
              alt={player.faction}
              w={24}
              h={24}
              className={classes.img}
            />
            <b className={classes.vp}>{player.totalVps}</b>
          </UnstyledButton>
        );
      })}
    </Box>
  );
}
