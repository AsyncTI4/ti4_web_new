import { memo } from "react";
import { Group, Stack, Text } from "@mantine/core";
import { calculateStatTilePositions } from "@/entities/geometry/tilePositioning";
import { determineOpenSides } from "@/entities/game/tileAdjacency";
import {
  getColorAlias,
  getPrimaryColorWithOpacity,
} from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";
import {
  SC_COLORS,
  SC_NUMBER_COLORS,
} from "@/entities/data/strategyCardColors";
import { CommandTokenStack } from "./CommandTokenStack";
import { PlayerStatsHex, buildStatHexagons } from "./PlayerStatsHex";
import styles from "./PlayerStatsArea.module.css";
import type { PlayerData } from "@/entities/data/types";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useGameContext } from "@/state/useGameContext";
import { useFactionImageUrl } from "@/hooks/useFactionImages";
import cx from "clsx";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";

const ARMADA_IDS = new Set(["armada", "tfarmada"]);

function playerHasArmada(playerData: PlayerData): boolean {
  return [
    ...(playerData.abilities ?? []),
    ...(playerData.techs ?? []),
    ...(playerData.factionTechs ?? []),
  ].some((id) => ARMADA_IDS.has(id.toLowerCase().replace(/[^a-z0-9]/g, "")));
}

type PlayerStatsAreaProps = {
  faction: string;
  playerData: PlayerData;
  statTilePositions: string[];
};

export const PlayerStatsArea = memo(function PlayerStatsArea({
  faction,
  playerData,
  statTilePositions,
}: PlayerStatsAreaProps) {
  const enhancedData = useGameContext();
  const factionUrl = useFactionImageUrl(faction);
  const factionColorMap = useFactionColors();

  if (!enhancedData || !statTilePositions?.length) return null;

  const {
    vpsToWin = 10,
    ringCount = 3,
    tilePositions: gameTilePositions,
  } = enhancedData;
  const color = factionColorMap[faction]?.color || playerData.color;
  const colorAlias = getColorAlias(color);

  const tilePositions = calculateStatTilePositions(
    statTilePositions,
    ringCount,
    gameTilePositions,
  );
  const { hexagons, svgBounds } = buildStatHexagons(
    tilePositions,
    faction,
    determineOpenSides(statTilePositions),
  );
  const borderColor = getPrimaryColorWithOpacity(color, 0.8);

  const backgroundTint = playerData.active
    ? "rgba(34, 197, 94, 0.4)"
    : playerData.passed
      ? "rgba(239, 68, 68, 0.4)"
      : undefined;

  const [firstHex, secondHex, thirdHex] = hexagons;

  const numScoredSecrets = playerData.secretsScored
    ? Object.values(playerData.secretsScored).length
    : 0;
  const hasArmadaBonus = playerHasArmada(playerData);

  return (
    <>
      <PlayerStatsHex
        hexagons={hexagons}
        svgBounds={svgBounds}
        faction={faction}
        borderColor={borderColor}
        backgroundTint={backgroundTint}
      />

      {firstHex && (
        <div
          className={styles.playerOverlay}
          style={{
            left: firstHex.cx - 140,
            top: firstHex.cy - 140,
          }}
        >
          <div
            className={styles.backgroundImage}
            style={{
              backgroundImage: `url(${factionUrl})`,
            }}
          />
          <div className={styles.textContainer}>
            <div className={styles.factionName}>
              {getPlayerFactionDisplayName(playerData).toUpperCase()}
            </div>

            {playerData.userName && (
              <div className={styles.playerName}>{playerData.userName}</div>
            )}

            <Group gap={1} justify="center" style={{ position: "relative" }}>
              {playerData.hasZeroToken && (
                <img
                  src={cdnImage("/player_area/pa_foresight.webp")}
                  alt="Zero Token"
                  className={styles.zeroTokenImage}
                />
              )}
              {playerData.scs.map((sc, index) => {
                const isExhausted = playerData.exhaustedSCs?.includes(sc);
                return (
                  <Text
                    key={sc}
                    className={cx(
                      styles.strategyCard,
                      playerData.hasZeroToken &&
                        styles.strategyCardWithZeroToken,
                    )}
                    c={isExhausted ? "gray.5" : SC_NUMBER_COLORS[SC_COLORS[sc]]}
                    style={{
                      right: `${24 - index * 36}px`,
                      fontSize: `${!playerData.hasZeroToken ? 64 : 48 - (playerData.scs.length - 1)}px`,
                    }}
                  >
                    {sc}
                  </Text>
                );
              })}
            </Group>

            {playerData.numScoreableSecrets > 0 && (
              <Group gap={0} justify="center">
                {Array.from({ length: numScoredSecrets }, (_, index) => (
                  <img
                    key={`scored-${index}`}
                    src={cdnImage("/player_area/pa_so-icon_scored.png")}
                    alt="Scored Secret"
                  />
                ))}

                {Array.from(
                  {
                    length: playerData.numUnscoredSecrets || 0,
                  },
                  (_, index) => (
                    <img
                      key={`unscored-${index}`}
                      src={cdnImage("/player_area/pa_so-icon_hand.png")}
                      alt="Secret in Hand"
                    />
                  ),
                )}

                {Array.from(
                  {
                    length: Math.max(
                      0,
                      playerData.numScoreableSecrets -
                        numScoredSecrets -
                        (playerData.numUnscoredSecrets || 0),
                    ),
                  },
                  (_, index) => (
                    <img
                      key={`empty-${index}`}
                      src={cdnImage("/player_area/pa_so-icon_hand.png")}
                      alt="Empty Secret Slot"
                      style={{ opacity: 0.2 }}
                    />
                  ),
                )}
              </Group>
            )}

            {playerData.totalVps !== undefined && (
              <div className={styles.victoryPoints}>
                {playerData.totalVps} / {vpsToWin} VP
              </div>
            )}
          </div>
        </div>
      )}

      {secondHex &&
        (playerData.tacticalCC > 0 ||
          playerData.fleetCC > 0 ||
          hasArmadaBonus ||
          !!playerData.mahactEdict?.length ||
          playerData.strategicCC > 0) && (
          <div
            className={styles.commandCountersOverlay}
            style={{
              left: secondHex.cx - 50,
              top: secondHex.cy,
            }}
          >
            <Stack gap={0}>
              <CommandTokenStack
                count={playerData.tacticalCC}
                colorAlias={colorAlias}
                faction={faction}
                type="command"
              />
              <CommandTokenStack
                count={playerData.fleetCC}
                colorAlias={colorAlias}
                faction={faction}
                type="fleet"
                mahactEdict={playerData.mahactEdict}
                hasArmadaBonus={hasArmadaBonus}
              />
              <CommandTokenStack
                count={playerData.strategicCC}
                colorAlias={colorAlias}
                faction={faction}
                type="command"
              />
            </Stack>
          </div>
        )}

      {thirdHex && (
        <div
          className={styles.tradeGoodsOverlay}
          style={{
            left: thirdHex.cx,
            top: thirdHex.cy,
          }}
        >
          {(playerData.active || playerData.passed) && (
            <div
              className={`${styles.playerStatusText} ${
                playerData.active
                  ? styles.playerStatusActive
                  : styles.playerStatusPassed
              }`}
            >
              {playerData.active ? "ACTIVE" : "PASSED"}
            </div>
          )}

          <Group gap="md" align="center" className={styles.tradeGoodsGroup}>
            <div className={styles.tradeGoodsContainer}>
              <img
                src={cdnImage("/player_area/pa_cardbacks_tradegoods.png")}
                className={styles.tradeGoodsImage}
              />
              <Text size="24px" fw={600} c="white" ff="heading">
                {playerData.tg || 0}
              </Text>
            </div>

            <div className={styles.commoditiesContainer}>
              <img
                src={cdnImage("/player_area/pa_cardbacks_commodities.png")}
                className={styles.commoditiesImage}
              />
              <Text
                size="24px"
                fw={600}
                c="white"
                className={styles.commoditiesText}
                ff="heading"
              >
                {playerData.commodities || 0}/{playerData.commoditiesTotal || 0}
              </Text>
            </div>
          </Group>
          {playerData.isSpeaker && (
            <img
              src={cdnImage("/tokens/token_speaker.png")}
              alt="Speaker Token"
            />
          )}
          {playerData.isTyrant && (
            <img
              src={cdnImage("/tokens/token_tyrant.png")}
              alt="Tyrant Token"
            />
          )}
        </div>
      )}
    </>
  );
});
