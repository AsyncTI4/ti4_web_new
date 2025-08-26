import { Box, Stack } from "@mantine/core";
import PlayerCardSidebar from "../../PlayerCardSidebar";
import PlayerCardSidebarTech from "../../PlayerCardSidebarTech";
import PlayerCardSidebarComponents from "../../PlayerCardSidebarComponents";
import PlayerCardSidebarStrength from "../../PlayerCardSidebarStrength";
import classes from "../../MapUI.module.css";
import { PlayerData } from "@/data/types";

type ActiveArea =
  | {
      type: "faction";
      faction: string;
      unitId?: string;
      coords: { x: number; y: number };
    }
  | { type: "tech" }
  | { type: "components" }
  | { type: "strength" }
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

  // For tech mode (when not hovering over a unit), show all players
  if (activeArea?.type === "tech") {
    return (
      <Stack className={classes.playerCardsContainer} gap={0}>
        {players.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarTech playerData={player} />
          </Box>
        ))}
      </Stack>
    );
  }

  // For components mode (when not hovering over a unit), show all players
  if (activeArea?.type === "components") {
    return (
      <Stack className={classes.playerCardsContainer}>
        {players.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarComponents playerData={player} />
          </Box>
        ))}
      </Stack>
    );
  }

  if (activeArea?.type === "strength") {
    return (
      <Stack className={classes.playerCardsContainer}>
        {players.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarStrength playerData={player} />
          </Box>
        ))}
      </Stack>
    );
  }

  return null;
}
