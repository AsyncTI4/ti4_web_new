import { useMemo, useState } from "react";
import { Group, Stack, Text } from "@mantine/core";
import { calculateTilePositions } from "../../mapgen/tilePositioning";
import { determineOpenSides } from "../../utils/tileAdjacency";
import { findColorData, getColorValues } from "../../lookup/colors";
import { cdnImage } from "../../data/cdnImage";
import { SC_COLORS, SC_NUMBER_COLORS } from "../../data/strategyCardColors";
import { CommandTokenStack } from "./CommandTokenStack";
import { getColorAlias } from "../../lookup/colors";
import { PlayerStatsHex, HexagonData } from "./PlayerStatsHex";
import styles from "./PlayerStatsArea.module.css";
import { PlayerData } from "@/data/types";

type PlayerStatsAreaProps = {
  faction: string;
  playerData: PlayerData;
  statTilePositions: string[];
  color: string;
  vpsToWin: number;
};

export function PlayerStatsArea({
  faction,
  playerData,
  statTilePositions,
  color,
  vpsToWin,
}: PlayerStatsAreaProps) {
  const [hexagons, setHexagons] = useState<HexagonData[]>([]);

  // Calculate tile positions for this faction's stat tiles
  const tilePositions = useMemo(() => {
    if (!statTilePositions || statTilePositions.length === 0) return [];

    // Create fake tile positions array for stat tiles (format: "position:systemId")
    const statTilePositionsArray = statTilePositions.map(
      (position) => `${position}:stat_${position}`
    );

    return calculateTilePositions(statTilePositionsArray, 6);
  }, [statTilePositions]);

  // Determine which sides should be open/closed for borders
  const openSides = useMemo(() => {
    return determineOpenSides(statTilePositions);
  }, [statTilePositions]);

  // Generate border color from player color
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

  // Handle hexagons calculation callback
  const handleHexagonsCalculated = (newHexagons: HexagonData[]) => {
    setHexagons(newHexagons);
  };

  // Get first, second, and third hexagon positions for HTML overlays
  const firstHex = hexagons[0];
  const secondHex = hexagons[1];
  const thirdHex = hexagons[2];

  const numScoredSecrets = Object.values(playerData.secretsScored).length;

  if (tilePositions.length === 0) return null;

  return (
    <>
      <PlayerStatsHex
        tilePositions={tilePositions}
        faction={faction}
        openSides={openSides}
        borderColor={borderColor}
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
              backgroundImage: `url(${cdnImage(`/factions/${faction}.png`)})`,
            }}
          />
          <div className={styles.textContainer}>
            <div className={styles.factionName}>{faction.toUpperCase()}</div>

            {playerData.userName && (
              <div className={styles.playerName}>{playerData.userName}</div>
            )}

            <Group gap={1} justify="center">
              {playerData.scs.map((sc: number) => {
                const isExhausted = playerData.exhaustedSCs?.includes(sc);
                return (
                  <Text
                    key={sc}
                    className={styles.strategyCard}
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
                {Array.from(
                  { length: playerData.numScoreableSecrets },
                  (_, index) => {
                    const isScored = index < (numScoredSecrets || 0);
                    return (
                      <img
                        key={index}
                        src={cdnImage(
                          isScored
                            ? "/player_area/pa_so-icon_scored.png"
                            : "/player_area/pa_so-icon_hand.png"
                        )}
                        alt={isScored ? "Scored Secret" : "Secret in Hand"}
                      />
                    );
                  }
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
          playerData.strategicCC > 0) && (
          <div
            style={{
              position: "absolute",
              left: secondHex.cx - 50,
              top: secondHex.cy,
              zIndex: 10,
              transform: "translate(-50%, -50%)",
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
          style={{
            position: "absolute",
            left: thirdHex.cx,
            top: thirdHex.cy,
            zIndex: 10,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Group
            gap="md"
            align="center"
            style={{ minWidth: 170, justifyContent: "center" }}
          >
            {/* Trade Goods */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                justifyContent: "center",
              }}
            >
              <img
                src={cdnImage("/player_area/pa_cardbacks_tradegoods.png")}
                style={{ height: 48, marginTop: 16 }}
              />
              <Text size="24px" fw={600} c="white" ff="heading">
                {playerData.tg || 0}
              </Text>
            </div>

            {/* Commodities */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <img
                src={cdnImage("/player_area/pa_cardbacks_commodities.png")}
                style={{ height: 48, marginTop: 16 }}
              />
              <Text
                size="24px"
                fw={600}
                c="white"
                style={{ marginTop: 4 }}
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
