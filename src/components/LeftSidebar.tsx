import { Box, Stack, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { SmoothPopover } from "./shared/SmoothPopover";
import { LawDetailsCard } from "./PlayerArea/LawDetailsCard";
import { PointTotals } from "./PlayerArea/PointTotals";
import { CompactObjectives } from "./PlayerArea";
import { CompactLaw } from "./PlayerArea/CompactLaw";
import React from "react";

const DEFAULT_VPS_TO_WIN = 10;

export function LeftSidebar({
  objectives,
  playerData,
  data,
  vpsToWin,
  lawsInPlay,
  selectedLaw,
  handleLawSelect,
  handleLawDeselect,
  settings,
  toggleLeftPanelCollapsed,
  classes,
}: {
  objectives: any;
  playerData: any[] | undefined;
  data: any;
  vpsToWin: number | undefined;
  lawsInPlay: any[] | undefined;
  selectedLaw: string | null;
  handleLawSelect: (lawId: string) => void;
  handleLawDeselect: () => void;
  settings: any;
  toggleLeftPanelCollapsed: () => void;
  classes: any;
}) {
  if (!((objectives && playerData) || (lawsInPlay && lawsInPlay.length > 0))) {
    return null;
  }

  if (!vpsToWin) vpsToWin = DEFAULT_VPS_TO_WIN;

  return (
    <>
      {/* Left Sidebar Overlay */}
      <Box
        className={`${classes.leftSidebarOverlay} ${settings.isLeftPanelCollapsed ? classes.collapsed : ""}`}
      >
        <Stack p="md" gap="md">
          {objectives && playerData && (
            <Box>
              {/* Game Info */}
              {playerData[0] && (
                <Stack gap={1} mb="xs">
                  <Text size="md" c="gray.1" ff="heading">
                    {data.gameName}
                    {data.gameCustomName &&
                      ` - ${data.gameCustomName}`}
                  </Text>
                  <Text size="md" c="gray.3">
                    Round {data.gameRound}
                  </Text>
                </Stack>
              )}
              <h3 className={classes.sectionHeading}>
                Public Objectives
              </h3>

              <CompactObjectives
                objectives={objectives}
                playerData={playerData}
              />
            </Box>
          )}

          {/* Point Totals */}
          {playerData && (
            <Box>
              <h3 className={classes.sectionHeading}>
                Point Totals ({vpsToWin} VP)
              </h3>
              <PointTotals
                playerData={playerData}
                vpsToWin={vpsToWin}
              />
            </Box>
          )}

          {/* Laws in Play */}
          {lawsInPlay && lawsInPlay.length > 0 && (
            <Box>
              <h3 className={classes.sectionHeading}>
                Laws in Play
              </h3>
              <Stack gap={2}>
                {lawsInPlay.map((law, index) => (
                  <SmoothPopover
                    key={`${law.id}-${index}`}
                    position="right"
                    opened={
                      selectedLaw === `${law.id}-${index}`
                    }
                    onChange={(opened) =>
                      opened 
                        ? handleLawSelect(`${law.id}-${index}`)
                        : handleLawDeselect()
                    }
                  >
                    <SmoothPopover.Target>
                      <div>
                        <CompactLaw
                          law={law}
                          onClick={() =>
                            handleLawSelect(`${law.id}-${index}`)
                          }
                        />
                      </div>
                    </SmoothPopover.Target>
                    <SmoothPopover.Dropdown p={0}>
                      <LawDetailsCard law={law} />
                    </SmoothPopover.Dropdown>
                  </SmoothPopover>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Left Panel Toggle Button */}
      <Box
        className={`${classes.leftPanelToggle} ${settings.isLeftPanelCollapsed ? classes.collapsed : ""}`}
        onClick={toggleLeftPanelCollapsed}
      >
        {settings.isLeftPanelCollapsed ? (
          <IconChevronRight
            size={16}
            className={classes.leftPanelToggleIcon}
          />
        ) : (
          <IconChevronLeft
            size={16}
            className={classes.leftPanelToggleIcon}
          />
        )}
      </Box>
    </>
  );
}

export const MemoizedLeftSidebar = React.memo(LeftSidebar, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.objectives) === JSON.stringify(nextProps.objectives) &&
    JSON.stringify(prevProps.playerData) === JSON.stringify(nextProps.playerData) &&
    JSON.stringify(prevProps.lawsInPlay) === JSON.stringify(nextProps.lawsInPlay) &&
    prevProps.vpsToWin === nextProps.vpsToWin &&
    prevProps.selectedLaw === nextProps.selectedLaw &&
    prevProps.settings.isLeftPanelCollapsed === nextProps.settings.isLeftPanelCollapsed &&
    prevProps.data?.gameName === nextProps.data?.gameName &&
    prevProps.data?.gameCustomName === nextProps.data?.gameCustomName &&
    prevProps.data?.gameRound === nextProps.data?.gameRound
  );
});