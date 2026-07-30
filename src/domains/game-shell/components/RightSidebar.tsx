import { Box, Center } from "@mantine/core";
import { FactionTabBar } from "@/domains/game-shell/components/navigation/FactionTabBar";
import { PlayerCardDisplay } from "./PlayerCardDisplay";
import { AreaType } from "@/hooks/useTabsAndTooltips";
import classes from "@/shared/ui/map/MapUI.module.css";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { PlayerDataErrorAlert } from "@/shared/ui/PlayerDataErrorAlert";
import { useSecretHandAccess } from "@/hooks/useSecretHandAccess";

type RightSidebarProps = {
  isRightPanelCollapsed: boolean;
  sidebarWidth: number;
  embeddedWidth?: string;
  selectedArea: AreaType;
  activeArea: AreaType;
  selectedFaction: string | null;
  hasActiveUnit: boolean;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
  gameId: string;
};

export function RightSidebar({
  isRightPanelCollapsed,
  sidebarWidth,
  embeddedWidth,
  selectedArea,
  activeArea,
  selectedFaction,
  hasActiveUnit,
  onAreaSelect,
  onAreaMouseEnter,
  onAreaMouseLeave,
  gameId,
}: RightSidebarProps) {
  const gameData = useGameData();
  const playerData = gameData?.playerData;
  const loadingState = useGameDataState();
  const isError = !!loadingState?.isError;

  const { userDiscordId } = useSecretHandAccess(playerData);
  const userPlayer = playerData?.find(
    (p) => p.discordId === userDiscordId,
  );

  const hoveredFaction =
    activeArea?.type === "faction" ? activeArea.faction : null;
  const effectiveFaction =
    hoveredFaction ?? selectedFaction ?? userPlayer?.faction ?? null;

  return (
    <Box
      className={`${classes.sidebar} ${isRightPanelCollapsed ? classes.collapsedRight : ""}`}
      style={{
        width: isRightPanelCollapsed ? "0%" : embeddedWidth || `${sidebarWidth}%`,
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
              activeFaction={effectiveFaction}
            />
          )}

          {isError && <PlayerDataErrorAlert gameId={gameId} mb="md" />}

          {playerData &&
            !selectedFaction &&
            !hasActiveUnit &&
            !effectiveFaction && (
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
    </Box>
  );
}
