import { Box, Group, Text, Image } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
import { Shimmer } from "./PlayerArea/Shimmer";

type FactionScore = {
  factionIcon: string;
  score: number;
};

type Props = {
  factionScores?: FactionScore[];
};

// Default data for demonstration
const DEFAULT_FACTION_SCORES: FactionScore[] = [
  { factionIcon: "/factions/hacan.png", score: 3 },
  { factionIcon: "/factions/letnev.png", score: 7 },
  { factionIcon: "/factions/titans.png", score: 5 },
  { factionIcon: "/factions/sol.png", score: 2 },
];

function ScoreBoard({ factionScores = DEFAULT_FACTION_SCORES }: Props) {
  // Create array of score positions 0-10
  const scorePositions = Array.from({ length: 11 }, (_, i) => i);

  // Group factions by their score
  const factionsByScore = factionScores.reduce(
    (acc, faction) => {
      if (!acc[faction.score]) {
        acc[faction.score] = [];
      }
      acc[faction.score].push(faction);
      return acc;
    },
    {} as Record<number, FactionScore[]>
  );

  return (
    <Surface
      p="xl"
      pattern="grid"
      cornerAccents={true}
      // label="SCOREBOARD"
      style={{
        width: "75vw",
        maxWidth: "75vw",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)",
      }}
    >
      <Box
        style={{
          display: "flex",
          width: "100%",
          height: "100px",
          overflow: "visible",
          padding: "8px 0",
        }}
      >
        {scorePositions.map((score, index) => {
          const factionsAtScore = factionsByScore[score] || [];
          const isWinningScore = score === 10;
          const isFirstSquare = index === 0;
          const isLastSquare = index === scorePositions.length - 1;

          return (
            <Box
              key={score}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderRadius: isFirstSquare
                  ? "10px 0 0 10px"
                  : isLastSquare
                    ? "0 10px 10px 0"
                    : "0",
                background: isWinningScore
                  ? `linear-gradient(145deg,
                      rgba(8, 20, 12, 0.95) 0%,
                      rgba(12, 28, 16, 0.9) 25%,
                      rgba(16, 35, 20, 0.85) 50%,
                      rgba(20, 42, 24, 0.9) 75%,
                      rgba(24, 48, 28, 0.95) 100%)`
                  : `linear-gradient(145deg,
                      rgba(8, 12, 20, 0.95) 0%,
                      rgba(12, 16, 28, 0.9) 25%,
                      rgba(16, 20, 35, 0.85) 50%,
                      rgba(20, 24, 42, 0.9) 75%,
                      rgba(24, 28, 48, 0.95) 100%)`,
                border: isWinningScore
                  ? "1px solid rgba(34, 197, 94, 0.3)"
                  : "1px solid rgba(30, 41, 59, 0.6)",
                borderLeft: isFirstSquare
                  ? undefined
                  : isWinningScore
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(30, 41, 59, 0.4)",
                boxShadow: isWinningScore
                  ? `inset 3px 3px 10px rgba(0, 0, 0, 0.8),
                     inset -2px -2px 6px rgba(34, 197, 94, 0.1),
                     inset 0 0 15px rgba(0, 0, 0, 0.5)`
                  : `inset 3px 3px 10px rgba(0, 0, 0, 0.8),
                     inset -2px -2px 6px rgba(148, 163, 184, 0.05),
                     inset 0 0 15px rgba(0, 0, 0, 0.5)`,
                overflow: "visible",
                transition: "all 0.3s ease",
              }}
            >
              {/* Brushed metal texture overlay */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      rgba(148, 163, 184, 0.02) 1px,
                      rgba(148, 163, 184, 0.04) 2px,
                      transparent 3px,
                      transparent 6px
                    ),
                    repeating-linear-gradient(
                      45deg,
                      rgba(0, 0, 0, 0.1) 0px,
                      rgba(0, 0, 0, 0.05) 1px,
                      transparent 2px,
                      transparent 8px
                    )
                  `,
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  opacity: 0.6,
                }}
              />

              {/* Top-left dark shadow for inset effect (light from top) */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "50%",
                  background: isWinningScore
                    ? "linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)"
                    : "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.25) 50%, transparent 100%)",
                  borderRadius: isFirstSquare
                    ? "10px 0 0 0"
                    : isLastSquare
                      ? "0 10px 0 0"
                      : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Left dark shadow for inset effect */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background: isWinningScore
                    ? "linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)"
                    : "linear-gradient(90deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 100%)",
                  borderRadius: isFirstSquare ? "10px 0 0 10px" : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Bottom highlight for inset effect (light from top) */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background: isWinningScore
                    ? "linear-gradient(0deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 50%, transparent 100%)"
                    : "linear-gradient(0deg, rgba(148, 163, 184, 0.06) 0%, rgba(148, 163, 184, 0.02) 50%, transparent 100%)",
                  borderRadius: isFirstSquare
                    ? "0 0 0 10px"
                    : isLastSquare
                      ? "0 0 10px 0"
                      : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Right highlight for inset effect */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "30%",
                  height: "100%",
                  background: isWinningScore
                    ? "linear-gradient(270deg, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0.02) 50%, transparent 100%)"
                    : "linear-gradient(270deg, rgba(148, 163, 184, 0.05) 0%, rgba(148, 163, 184, 0.02) 50%, transparent 100%)",
                  borderRadius: isLastSquare ? "0 10px 10px 0" : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Subtle inner rim for definition */}
              <Box
                style={{
                  position: "absolute",
                  top: "1px",
                  left: "1px",
                  right: "1px",
                  bottom: "1px",
                  border: isWinningScore
                    ? "1px solid rgba(34, 197, 94, 0.15)"
                    : "1px solid rgba(148, 163, 184, 0.08)",
                  borderRadius: isFirstSquare
                    ? "9px 0 0 9px"
                    : isLastSquare
                      ? "0 9px 9px 0"
                      : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Enhanced snazzy score number */}
              <Text
                size="lg"
                fw={800}
                ff="heading"
                c={isWinningScore ? "green.1" : "slate.1"}
                style={{
                  textShadow: isWinningScore
                    ? `0 0 8px rgba(34, 197, 94, 0.8),
                       0 0 16px rgba(34, 197, 94, 0.5),
                       0 2px 4px rgba(0, 0, 0, 0.9),
                       0 1px 0 rgba(255, 255, 255, 0.3)`
                    : `0 2px 4px rgba(0, 0, 0, 0.9),
                       0 0 6px rgba(148, 163, 184, 0.4),
                       0 1px 0 rgba(255, 255, 255, 0.2)`,
                  fontSize: "24px",
                  fontWeight: 900,
                  position: "absolute",
                  top: "8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  letterSpacing: "2px",
                  filter: isWinningScore
                    ? "drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))"
                    : "drop-shadow(0 0 2px rgba(148, 163, 184, 0.3))",
                }}
              >
                {score}
              </Text>

              {/* Faction control tokens - repositioned to prevent cutoff */}
              {factionsAtScore.length > 0 && (
                <Box
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    zIndex: 2,
                    maxHeight: "50px",
                    overflow: "visible",
                  }}
                >
                  {factionsAtScore.slice(0, 2).map((faction, index) => (
                    <Box
                      key={index}
                      pos="relative"
                      style={{
                        width: "38px",
                      }}
                    >
                      {/* Control token background */}
                      <Image
                        src="/control/control_gld.png"
                        style={{
                          width: "38px",
                        }}
                      />
                      {/* Faction icon */}
                      <Image
                        src={faction.factionIcon}
                        style={{
                          width: "24px",
                          height: "24px",
                          position: "absolute",
                          top: "0px",
                          left: "6px",
                          filter:
                            "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9)) brightness(1.05)",
                        }}
                      />
                    </Box>
                  ))}
                  {/* Show count if more than 2 factions */}
                  {factionsAtScore.length > 2 && (
                    <Text
                      size="xs"
                      fw={700}
                      c="yellow.3"
                      style={{
                        fontSize: "10px",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "8px",
                        padding: "1px 4px",
                      }}
                    >
                      +{factionsAtScore.length - 2}
                    </Text>
                  )}
                </Box>
              )}

              {/* Enhanced special effects for winning score */}
              {isWinningScore && (
                <>
                  {/* Pulsing glow effect */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "-4px",
                      left: "-4px",
                      right: "-4px",
                      bottom: "-4px",
                      background:
                        "linear-gradient(45deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.15))",
                      borderRadius: "16px",
                      animation: "scoreboardPulse 2s ease-in-out infinite",
                      zIndex: -1,
                    }}
                  />

                  {/* Enhanced victory crown */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "-12px",
                      width: "28px",
                      height: "28px",
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(255, 193, 7, 0.9) 50%, rgba(255, 171, 0, 0.95) 100%)",
                      borderRadius: "50%",
                      border: "3px solid rgba(255, 215, 0, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        "0 4px 12px rgba(255, 215, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
                      zIndex: 4,
                    }}
                  >
                    <Text
                      size="sm"
                      fw={700}
                      c="yellow.9"
                      style={{
                        fontSize: "14px",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      ★
                    </Text>
                  </Box>
                </>
              )}

              {/* Refined empty square indicator */}
              {factionsAtScore.length === 0 && (
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "32px",
                    height: "32px",
                    border: "2px dashed rgba(148, 163, 184, 0.25)",
                    borderRadius: "50%",
                    opacity: 0.4,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Enhanced global styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes scoreboardPulse {
            0%, 100% {
              opacity: 0.7;
              transform: scale(1);
            }
            50% {
              opacity: 0.9;
              transform: scale(1.03);
            }
          }
        `,
        }}
      />
    </Surface>
  );
}

export default ScoreBoard;
