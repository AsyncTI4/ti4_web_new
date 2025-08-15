import { Box, Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { FactionTabBar } from "../../FactionTabBar";
import { PlayerCardDisplay } from "../PlayerCardDisplay";
import { SecretHand } from "../SecretHand";
import { AreaType } from "../../../hooks/useTabsAndTooltips";
import classes from "../../MapUI.module.css";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { usePlayerHand } from "../../../hooks/usePlayerHand";
import { useUser } from "../../../hooks/useUser";

type RightSidebarProps = {
  isRightPanelCollapsed: boolean;
  sidebarWidth: number;
  selectedArea: AreaType;
  activeArea: AreaType;
  selectedFaction: string | null;
  activeUnit: any;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
  gameId: string;
};

export function RightSidebar({
  isRightPanelCollapsed,
  sidebarWidth,
  selectedArea,
  activeArea,
  selectedFaction,
  activeUnit,
  onAreaSelect,
  onAreaMouseEnter,
  onAreaMouseLeave,
  gameId,
}: RightSidebarProps) {
  const [isSecretHandCollapsed, setIsSecretHandCollapsed] = useState(false);
  const gameData = useGameData();
  const playerData = gameData?.playerData;
  const loadingState = useGameDataState();
  const isError = !!loadingState?.isError;

  const { user } = useUser();
  const isUserAuthenticated = user?.authenticated;
  const isInGame = playerData?.some((p) => p.discordId === user?.discord_id);

  // Fetch player hand data
  const {
    data: handData,
    isLoading: isHandLoading,
    error: handError,
  } = usePlayerHand(gameId);
  const userPlayer = playerData?.find((p) => p.discordId === user?.discord_id);

  // Determine the effective active area - default to user's faction if they're in the game
  const effectiveActiveArea = (() => {
    if (activeArea || selectedArea) return activeArea || selectedArea;
    if (userPlayer) {
      return {
        type: "faction" as const,
        faction: userPlayer.faction,
        coords: { x: 0, y: 0 },
      };
    }
    return null;
  })();

  return (
    <Box
      className={`${classes.sidebar} ${isRightPanelCollapsed ? classes.collapsedRight : ""}`}
      style={{
        width: isRightPanelCollapsed ? "0%" : `${sidebarWidth}%`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Main Content Pane - Top */}
      <Box
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {playerData && (
          <FactionTabBar
            playerData={playerData}
            selectedArea={selectedArea}
            activeArea={activeArea}
            onAreaSelect={onAreaSelect}
            onAreaMouseEnter={onAreaMouseEnter}
            onAreaMouseLeave={onAreaMouseLeave}
          />
        )}

        <Box style={{ flex: 1, overflow: "auto" }}>
          {playerData && (
            <PlayerCardDisplay
              playerData={playerData}
              activeArea={effectiveActiveArea}
            />
          )}

          {isError && (
            <Alert
              variant="light"
              color="red"
              title="Error loading player data"
              icon={<IconAlertCircle />}
              mb="md"
            >
              Could not load player data for game {gameId}. Please try again
              later.
            </Alert>
          )}

          {playerData &&
            !selectedFaction &&
            !activeUnit &&
            !effectiveActiveArea && (
              <Center h="200px" className={classes.hoverInstructions}>
                <Box>
                  <div>Hover over a unit</div>
                  <div>on the map to view</div>
                  <div>player details</div>
                  <div className={classes.hoverInstructionsLine}>
                    Click to pin a player
                  </div>
                </Box>
              </Center>
            )}
        </Box>
      </Box>

      {/* Secret Hand Pane - Bottom - Only show if user is authenticated */}
      {isUserAuthenticated && isInGame && (
        <Box style={{ flexShrink: 0 }}>
          <SecretHand
            isCollapsed={isSecretHandCollapsed}
            onToggle={() => setIsSecretHandCollapsed(!isSecretHandCollapsed)}
            handData={handData}
            isLoading={isHandLoading}
            error={handError}
            playerData={playerData}
            activeArea={effectiveActiveArea}
            userDiscordId={user?.discord_id}
          />
        </Box>
      )}
    </Box>
  );
}
