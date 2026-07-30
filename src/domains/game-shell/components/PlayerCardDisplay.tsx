import { Box } from "@mantine/core";
import { memo } from "react";
import PlayerCardSidebar from "@/domains/player/components/composition/PlayerCardSidebar";
import classes from "@/shared/ui/map/MapUI.module.css";
import { PlayerData } from "@/entities/data/types";
import { filterPlayersWithAssignedFaction } from "@/utils/playerUtils";

type PlayerCardDisplayProps = {
  playerData: PlayerData[];
  activeFaction: string | null;
};

export const PlayerCardDisplay = memo(function PlayerCardDisplay({
  playerData,
  activeFaction,
}: PlayerCardDisplayProps) {
  const players = filterPlayersWithAssignedFaction(playerData);
  if (activeFaction) {
    const playerToShow = players.find(
      (player) => player.faction === activeFaction
    );
    if (!playerToShow) return null;

    return (
      <Box className={classes.playerCardsContainer}>
        <Box className={classes.playerCard}>
          <PlayerCardSidebar key={activeFaction} playerData={playerToShow} />
        </Box>
      </Box>
    );
  }

  return null;
});
