import type { CSSProperties, ReactNode } from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import classes from "@/shared/ui/map/MapUI.module.css";
import type { useGameData } from "@/hooks/useGameContext";
import { ScoreTracker } from "@/domains/objectives/components";
import ExpandedPublicObjectives from "@/domains/objectives/components/PublicObjectives/ExpandedPublicObjectives";
import { PlayerScoreSummary } from "@/domains/objectives/components/PlayerScoreSummary/PlayerScoreSummary";
import PlayerCardMobile from "@/domains/player/components/composition/PlayerCardMobile";
import { ScaledContent } from "@/shared/ui/ScaledContent";
import Caption from "@/shared/ui/Caption/Caption";
import { filterPlayersWithAssignedFaction } from "@/utils/playerUtils";
import { computePanelsZoom } from "@/utils/zoom";

type GameData = NonNullable<ReturnType<typeof useGameData>>;

function HudSection({
  isMobile,
  innerStyle,
  children,
}: {
  isMobile: boolean;
  innerStyle: CSSProperties;
  children: ReactNode;
}) {
  return (
    <ScaledContent
      zoom={computePanelsZoom()}
      innerStyle={innerStyle}
      enabled={isMobile}
      className={classes.hudSection}
    >
      {children}
    </ScaledContent>
  );
}

function HudTitle({ gameData }: { gameData: GameData }) {
  return (
    <Group align="baseline" gap={12} wrap="nowrap" className={classes.hudTitle}>
      <Text span className={classes.hudRoundLabel}>
        Round
      </Text>
      <Text span className={classes.hudRoundNumeral}>
        {String(gameData.gameRound ?? 1).padStart(2, "0")}
      </Text>
      {gameData.gameName && (
        <Text span className={classes.hudGameName}>
          {gameData.gameName}
          {gameData.gameCustomName && ` — ${gameData.gameCustomName}`}
        </Text>
      )}
      <span className={classes.hudRule} />
    </Group>
  );
}

/**
 * The deck under the board. Horizontal padding belongs to its sections so
 * every block lines up on one margin; the player-area column resolves to the
 * widest card so data groups align vertically.
 */
export function BoardHud({
  gameData,
  bleedBottom,
  isMobile,
}: {
  gameData: GameData | undefined;
  bleedBottom: number;
  isMobile: boolean;
}) {
  const contentWidth = isMobile ? "1300px" : "2150px";
  const areaStyles = isMobile
    ? { width: contentWidth }
    : { minWidth: contentWidth };
  const playerAreaStyles = { minWidth: contentWidth };

  return (
    <Box
      className={classes.bottomHud}
      style={{ "--board-bleed-bottom": `${bleedBottom}px` } as CSSProperties}
    >
      <Box className={classes.bottomHudBody}>
        {gameData && (
          <HudSection isMobile={isMobile} innerStyle={areaStyles}>
            <Stack gap="md">
              <HudTitle gameData={gameData} />
              <Box className={classes.hudFitScreen}>
                <ScoreTracker
                  playerData={gameData.playerData}
                  vpsToWin={gameData.vpsToWin || 10}
                />
              </Box>
              <Box className={classes.hudFitScreen}>
                <ExpandedPublicObjectives
                  objectives={gameData.objectives}
                  playerData={gameData.playerData}
                  lawsInPlay={gameData.lawsInPlay}
                />
              </Box>
            </Stack>
          </HudSection>
        )}

        <HudSection isMobile={isMobile} innerStyle={playerAreaStyles}>
          <Stack gap={4} style={{ width: "max-content", minWidth: "100%" }}>
            <Caption size="sm" rule mt={4}>
              Player Areas
            </Caption>
            {filterPlayersWithAssignedFaction(gameData?.playerData ?? []).map(
              (player) => (
                <Box key={player.color}>
                  <PlayerCardMobile playerData={player} />
                </Box>
              ),
            )}
          </Stack>
        </HudSection>

        {gameData && (
          <HudSection isMobile={isMobile} innerStyle={areaStyles}>
            <PlayerScoreSummary
              playerData={gameData.playerData}
              objectives={gameData.objectives}
            />
          </HudSection>
        )}
      </Box>
    </Box>
  );
}
