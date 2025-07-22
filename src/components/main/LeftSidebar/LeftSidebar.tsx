import { Box, Stack, Text } from "@mantine/core";
import { CompactObjectives } from "../../PlayerArea/CompactObjectives";
import { PointTotals } from "../../PlayerArea/PointTotals";
import { CompactLaw } from "../../PlayerArea/CompactLaw";
import { LawDetailsCard } from "../../PlayerArea/LawDetailsCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useSettings } from "../../../context/SettingsContext";
import { useState } from "react";
import classes from "../../MapUI.module.css";
import { EnhancedPlayerData } from "@/data/enhancePlayerData";

type LeftSidebarProps = {
  enhancedData?: EnhancedPlayerData;
};

export function LeftSidebar({ enhancedData }: LeftSidebarProps) {
  if (!enhancedData) return null;
  const {
    objectives,
    playerData,
    lawsInPlay,
    vpsToWin,
    gameName,
    gameCustomName,
    gameRound,
  } = enhancedData;
  const { settings } = useSettings();
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);

  return (
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
                  {gameName}
                  {gameCustomName && ` - ${gameCustomName}`}
                </Text>
                <Text size="md" c="gray.3">
                  Round {gameRound}
                </Text>
              </Stack>
            )}
            <h3 className={classes.sectionHeading}>Public Objectives</h3>

            <CompactObjectives
              objectives={objectives}
              playerData={playerData}
            />
          </Box>
        )}

        {playerData && (
          <Box>
            <h3 className={classes.sectionHeading}>
              Point Totals ({vpsToWin} VP)
            </h3>
            <PointTotals playerData={playerData} vpsToWin={vpsToWin} />
          </Box>
        )}

        {lawsInPlay && lawsInPlay.length > 0 && (
          <Box>
            <h3 className={classes.sectionHeading}>Laws in Play</h3>
            <Stack gap={2}>
              {lawsInPlay.map((law, index) => (
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
    </Box>
  );
}
