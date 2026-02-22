import { Box, Stack, Text } from "@mantine/core";
import { CompactObjectives } from "@/domains/player/components/PlayerArea/CompactObjectives";
import { PointTotals } from "@/domains/player/components/PlayerArea/PointTotals";
import { CompactLaw } from "@/domains/player/components/PlayerArea/CompactLaw";
import { LawDetailsCard } from "@/domains/player/components/PlayerArea/LawDetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useSettingsStore } from "@/utils/appStore";
import { useState } from "react";
import classes from "@/shared/ui/map/MapUI.module.css";
import { useGameData } from "@/hooks/useGameContext";

export function LeftSidebar() {
  const gameData = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const hasData = gameData?.objectives && gameData?.playerData;

  return (
    <Box
      className={`${classes.leftSidebarOverlay} ${settings.leftPanelCollapsed ? classes.leftSidebarOverlayCollapsed : ""}`}
    >
      {hasData && (
        <Stack p="md" gap="md">
          <Box>
            {/* Game Info */}
            {gameData.playerData[0] && (
              <Stack gap={1} mb="xs">
                <Text size="md" c="gray.1" ff="heading">
                  {gameData.gameName}
                  {gameData.gameCustomName && ` - ${gameData.gameCustomName}`}
                </Text>
                <Text size="md" c="gray.3">
                  Round {gameData.gameRound}
                </Text>
              </Stack>
            )}
            <h3 className={classes.sectionHeading}>Public Objectives</h3>

            <CompactObjectives
              objectives={gameData.objectives}
              playerData={gameData.playerData}
            />
          </Box>

          <Box>
            <h3 className={classes.sectionHeading}>
              Point Totals ({gameData.vpsToWin} VP)
            </h3>
            <PointTotals
              playerData={gameData.playerData}
              vpsToWin={gameData.vpsToWin}
            />
          </Box>

          {gameData.lawsInPlay && gameData.lawsInPlay.length > 0 && (
            <Box>
              <h3 className={classes.sectionHeading}>Laws in Play</h3>
              <Stack gap={2}>
                {gameData.lawsInPlay.map((law, index) => (
                  <SmoothPopover
                    key={`${law.id}-${index}`}
                    position="right"
                    opened={selectedLaw === `${law.id}-${index}`}
                    onChange={(opened) =>
                      setSelectedLaw(opened ? `${law.id}-${index}` : null)
                    }
                  >
                    <SmoothPopover.Target>
                      <div>
                        <CompactLaw
                          law={law}
                          onClick={() => setSelectedLaw(`${law.id}-${index}`)}
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
      )}
    </Box>
  );
}
