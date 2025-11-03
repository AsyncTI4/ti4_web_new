import { Box, Stack } from "@mantine/core";
import PlayerCardSidebar from "../../PlayerCardSidebar";
import classes from "../../MapUI.module.css";
import { PlayerData } from "@/data/types";

type ActiveArea =
  | {
      type: "faction";
      faction: string;
      unitId?: string;
      coords: { x: number; y: number };
    }
  | null;

type PlayerCardDisplayProps = {
  playerData: PlayerData[];
  activeArea: ActiveArea;
};

export function PlayerCardDisplay({
  playerData,
  activeArea,
}: PlayerCardDisplayProps) {
  const players = playerData.filter((player) => player.faction !== "null");
  if (activeArea?.type === "faction") {
    const playerToShow = players.find(
      (player) => player.faction === activeArea.faction
    );
    if (!playerToShow) return null;

    return (
      <Box className={classes.playerCardsContainer}>
        <Box className={classes.playerCard}>
          <PlayerCardSidebar playerData={playerToShow} />
        </Box>
      </Box>
    );
  }

  return null;
}
