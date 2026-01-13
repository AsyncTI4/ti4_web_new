import { useMemo, useState } from "react";
import { Group, Stack, Text } from "@mantine/core";
import {
  calculateTilePositions,
  isFractureInPlay,
} from "../../mapgen/tilePositioning";
import { determineOpenSides } from "../../utils/tileAdjacency";
import { findColorData, getColorValues } from "../../lookup/colors";
import { cdnImage } from "../../data/cdnImage";
import { SC_COLORS, SC_NUMBER_COLORS } from "../../data/strategyCardColors";
import { CommandTokenStack } from "./CommandTokenStack";
import { getColorAlias } from "../../lookup/colors";
import { PlayerStatsHex, HexagonData } from "./PlayerStatsHex";
import styles from "./PlayerStatsArea.module.css";
import { PlayerData } from "@/data/types";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useGameContext } from "@/hooks/useGameContext";
import { useFactionImages } from "@/hooks/useFactionImages";
import { getFactionImage } from "@/lookup/factions";
import cx from "clsx";

type PlayerStatsAreaProps = {
  faction: string;
  playerData: PlayerData;
  statTilePositions: string[];
};

export function PlayerStatsArea({
  faction,
  playerData,
  statTilePositions,
}: PlayerStatsAreaProps) {
  const enhancedData = useGameContext();
  const factionImages = useFactionImages();
  const factionImage = factionImages[faction]?.image;
  const factionImageType = factionImages[faction]?.type;
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);
  const factionColorMap = useFactionColors();
  const [hexagons, setHexagons] = useState<HexagonData[]>([]);

  if (!enhancedData) return null;

  const {
    vpsToWin = 10,
    ringCount = 3,
    tilePositions: gameTilePositions,
  } = enhancedData;
  const color = factionColorMap[faction]?.color || playerData.color;

  const tilePositions = useMemo(() => {
    if (!statTilePositions || statTilePositions.length === 0) return [];
    const statTilePositionsArray = statTilePositions.map(
      (position) => `${position}:stat_${position}`
    );
    const fractureYbump =
      gameTilePositions && isFractureInPlay(gameTilePositions) ? 400 : 0;
    const positions = calculateTilePositions(
      statTilePositionsArray,
      ringCount,
      fractureYbump
    );
    return positions;
  }, [statTilePositions, ringCount, gameTilePositions]);

  const openSides = useMemo(() => {
    return determineOpenSides(statTilePositions);
  }, [statTilePositions]);

  const borderColor = useMemo(() => {
    const colorData = findColorData(color);
    if (!colorData) return "rgba(148, 163, 184, 0.8)"; // fallback

    const primaryColorValues = getColorValues(
      colorData.primaryColorRef,
      colorData.primaryColor
    );
    if (!primaryColorValues) return "rgba(148, 163, 184, 0.8)"; // fallback
    const { red, green, blue } = primaryColorValues;
    return `rgba(${red}, ${green}, ${blue}, 0.8)`;
  }, [color]);

  // Generate background tint based on player status
  const backgroundTint = playerData.active
    ? "rgba(34, 197, 94, 0.4)" // green tint for active players
    : playerData.passed
      ? "rgba(239, 68, 68, 0.4)" // red tint for passed players
      : undefined; // no tint for normal state

  // Handle hexagons calculation callback
  const handleHexagonsCalculated = (newHexagons: HexagonData[]) => {
    setHexagons(newHexagons);
  };

  // Get first, second, and third hexagon positions for HTML overlays
  const firstHex = hexagons[0];
  const secondHex = hexagons[1];
  const thirdHex = hexagons[2];

  const numScoredSecrets = playerData.secretsScored
    ? Object.values(playerData.secretsScored).length
    : 0;

  if (tilePositions.length === 0) return null;

  return (
    <>
      <PlayerStatsHex
        tilePositions={tilePositions}
        faction={faction}
        openSides={openSides}
        borderColor={borderColor}
        backgroundTint={backgroundTint}
        onHexagonsCalculated={handleHexagonsCalculated}
      />

      {/* HTML overlay for first hexagon player info */}
      {firstHex && playerData && (
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
            <div className={styles.factionName}>{faction.toUpperCase()}</div>

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
              {playerData.scs.map((sc: number) => {
                const isExhausted = playerData.exhaustedSCs?.includes(sc);
                return (
                  <Text
                    key={sc}
                    className={cx(
                      styles.strategyCard,
                      playerData.hasZeroToken &&
                        styles.strategyCardWithZeroToken
                    )}
                    c={
                      isExhausted
                        ? "gray.5"
                        : SC_NUMBER_COLORS[
                            SC_COLORS[sc as keyof typeof SC_COLORS]
                          ]
                    }
                  >
                    {sc}
                  </Text>
                );
              })}
            </Group>

            {/* Secret Objectives */}
            {playerData.numScoreableSecrets > 0 && (
              <Group gap={0} justify="center">
                {/* Render scored secrets */}
                {Array.from({ length: numScoredSecrets }, (_, index) => (
                  <img
                    key={`scored-${index}`}
                    src={cdnImage("/player_area/pa_so-icon_scored.png")}
                    alt="Scored Secret"
                  />
                ))}

                {/* Render unscored secrets in hand */}
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
                  )
                )}

                {/* Render empty slots with reduced opacity */}
                {Array.from(
                  {
                    length: Math.max(
                      0,
                      playerData.numScoreableSecrets -
                        numScoredSecrets -
                        (playerData.numUnscoredSecrets || 0)
                    ),
                  },
                  (_, index) => (
                    <img
                      key={`empty-${index}`}
                      src={cdnImage("/player_area/pa_so-icon_hand.png")}
                      alt="Empty Secret Slot"
                      style={{ opacity: 0.2 }}
                    />
                  )
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

      {/* HTML overlay for second hexagon command counters */}
      {secondHex &&
        playerData &&
        (playerData.tacticalCC > 0 ||
          playerData.fleetCC > 0 ||
          (playerData.mahactEdict?.length && playerData.mahactEdict.length > 0) ||
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
                colorAlias={getColorAlias(color)}
                faction={faction}
                type="command"
              />
              <CommandTokenStack
                count={playerData.fleetCC}
                colorAlias={getColorAlias(color)}
                faction={faction}
                type="fleet"
                mahactEdict={playerData.mahactEdict}
              />
              <CommandTokenStack
                count={playerData.strategicCC}
                colorAlias={getColorAlias(color)}
                faction={faction}
                type="command"
              />
            </Stack>
          </div>
        )}

      {/* HTML overlay for third hexagon trade goods and commodities */}
      {thirdHex && playerData && (
        <div
          className={styles.tradeGoodsOverlay}
          style={{
            left: thirdHex.cx,
            top: thirdHex.cy,
          }}
        >
          {/* Player Status Text */}
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
            {/* Trade Goods */}
            <div className={styles.tradeGoodsContainer}>
              <img
                src={cdnImage("/player_area/pa_cardbacks_tradegoods.png")}
                className={styles.tradeGoodsImage}
              />
              <Text size="24px" fw={600} c="white" ff="heading">
                {playerData.tg || 0}
              </Text>
            </div>

            {/* Commodities */}
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
          {/* Speaker Token if applicable */}
          {playerData.isSpeaker && (
            <img
              src={cdnImage("/tokens/token_speaker.png")}
              alt="Speaker Token"
            />
          )}
        </div>
      )}
    </>
  );
}
