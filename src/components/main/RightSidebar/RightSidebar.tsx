import { Box, Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { FactionTabBar } from "../../FactionTabBar";
import { PlayerCardDisplay } from "../PlayerCardDisplay";
import { AreaType } from "../../../hooks/useTabsAndTooltips";
import classes from "../../MapUI.module.css";
import { useGameData } from "@/hooks/useGameContext";
import { useContext } from "react";
import { EnhancedDataContext } from "@/context/GameContextProvider";

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
  const ctx = useContext(EnhancedDataContext);
  const isError = !!ctx?.dataState.isError;

  return (
    <Box
      className={`${classes.sidebar} ${isRightPanelCollapsed ? classes.collapsedRight : ""}`}
      style={{
        width: isRightPanelCollapsed ? "0%" : `${sidebarWidth}%`,
      }}
    >
      {playerData && (
        <>
          <FactionTabBar
            playerData={playerData}
            selectedArea={selectedArea}
            activeArea={activeArea}
            onAreaSelect={onAreaSelect}
            onAreaMouseEnter={onAreaMouseEnter}
            onAreaMouseLeave={onAreaMouseLeave}
          />

          <PlayerCardDisplay
            playerData={playerData}
            activeArea={activeArea || selectedArea}
          />

          {!selectedFaction && !activeUnit && (
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
        </>
      )}

      {isError && (
        <Alert
          variant="light"
          color="red"
          title="Error loading player data"
          icon={<IconAlertCircle />}
          mb="md"
        >
          Could not load player data for game {gameId}. Please try again later.
        </Alert>
      )}
    </Box>
  );
}
