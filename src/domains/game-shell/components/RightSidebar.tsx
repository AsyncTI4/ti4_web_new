import { Box, Center } from "@mantine/core";
import { FactionTabBar } from "@/domains/game-shell/components/navigation/FactionTabBar";
import { PlayerCardDisplay } from "./PlayerCardDisplay";
import { SecretHand } from "./SecretHand";
import { AreaType } from "@/hooks/useTabsAndTooltips";
import classes from "@/shared/ui/map/MapUI.module.css";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { PlayerDataErrorAlert } from "@/shared/ui/PlayerDataErrorAlert";
import { useSecretHandPanel } from "@/hooks/useSecretHandPanel";

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
  const gameData = useGameData();
  const playerData = gameData?.playerData;
  const loadingState = useGameDataState();
  const isError = !!loadingState?.isError;

  const {
    canViewSecretHand,
    userDiscordId,
    handData,
    isHandLoading,
    handError,
    isSecretHandCollapsed,
    toggleSecretHandCollapsed,
  } = useSecretHandPanel({ gameId, playerData });
  const userPlayer = playerData?.find(
    (p) => p.discordId === userDiscordId,
  );

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

          {isError && <PlayerDataErrorAlert gameId={gameId} mb="md" />}

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
      {canViewSecretHand && (
        <Box style={{ flexShrink: 0 }}>
          <SecretHand
            isCollapsed={isSecretHandCollapsed}
            onToggle={toggleSecretHandCollapsed}
            handData={handData}
            isLoading={isHandLoading}
            error={handError}
            playerData={playerData}
            activeArea={effectiveActiveArea}
            userDiscordId={userDiscordId ?? undefined}
          />
        </Box>
      )}
    </Box>
  );
}
