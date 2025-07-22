import { Box, Stack } from "@mantine/core";
import PlayerCardSidebar from "../../PlayerCardSidebar";
import PlayerCardSidebarTech from "../../PlayerCardSidebarTech";
import PlayerCardSidebarComponents from "../../PlayerCardSidebarComponents";
import PlayerCardSidebarStrength from "../../PlayerCardSidebarStrength";
import classes from "../../MapUI.module.css";

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
  playerData: any[];
  activeArea: ActiveArea;
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
  planetAttachments: Record<string, string[]>;
};

export function PlayerCardDisplay({
  playerData,
  activeArea,
  factionToColor,
  colorToFaction,
  planetAttachments,
}: PlayerCardDisplayProps) {
  if (activeArea?.type === "faction") {
    const playerToShow = playerData.find(
      (player) => player.faction === activeArea.faction
    );
    if (!playerToShow) return null;

    return (
      <Box className={classes.playerCardsContainer}>
        <Box className={classes.playerCard}>
          <PlayerCardSidebar
            playerData={playerToShow}
            factionToColor={factionToColor}
            colorToFaction={colorToFaction}
            planetAttachments={planetAttachments}
          />
        </Box>
      </Box>
    );
  }

  // For tech mode (when not hovering over a unit), show all players
  if (activeArea?.type === "tech") {
    return (
      <Stack className={classes.playerCardsContainer} gap={0}>
        {playerData.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarTech
              playerData={player}
              factionToColor={factionToColor}
              colorToFaction={colorToFaction}
            />
          </Box>
        ))}
      </Stack>
    );
  }

  // For components mode (when not hovering over a unit), show all players
  if (activeArea?.type === "components") {
    return (
      <Stack className={classes.playerCardsContainer}>
        {playerData.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarComponents
              playerData={player}
              factionToColor={factionToColor}
              colorToFaction={colorToFaction}
            />
          </Box>
        ))}
      </Stack>
    );
  }

  if (activeArea?.type === "strength") {
    return (
      <Stack className={classes.playerCardsContainer}>
        {playerData.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarStrength playerData={player} />
          </Box>
        ))}
      </Stack>
    );
  }

  return null;
}
