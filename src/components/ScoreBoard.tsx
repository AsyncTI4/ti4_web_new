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
          height: "120px",
          overflow: "visible",
          padding: "12px 0", // Add padding to prevent badge cutoff
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
                  ? "12px 0 0 12px"
                  : isLastSquare
                    ? "0 12px 12px 0"
                    : "0",
                background: isWinningScore
                  ? "linear-gradient(145deg, rgba(15, 35, 20, 0.95) 0%, rgba(25, 50, 30, 0.8) 50%, rgba(20, 40, 25, 0.9) 100%)"
                  : "linear-gradient(145deg, rgba(15, 20, 35, 0.95) 0%, rgba(25, 30, 45, 0.8) 50%, rgba(20, 25, 40, 0.9) 100%)",
                border: isWinningScore
                  ? "2px solid rgba(34, 197, 94, 0.4)"
                  : "1px solid rgba(71, 85, 105, 0.4)",
                borderLeft: isFirstSquare
                  ? undefined
                  : isWinningScore
                    ? "2px solid rgba(34, 197, 94, 0.4)" // Keep left border for winning square
                    : "1px solid rgba(71, 85, 105, 0.2)",
                boxShadow: isWinningScore
                  ? "inset 3px 3px 8px rgba(0, 0, 0, 0.7), inset -2px -2px 6px rgba(34, 197, 94, 0.12), 0 0 20px rgba(34, 197, 94, 0.3)"
                  : "inset 3px 3px 8px rgba(0, 0, 0, 0.7), inset -2px -2px 6px rgba(148, 163, 184, 0.08)",
                overflow: "visible", // Allow victory badge to show
                transition: "all 0.3s ease",
              }}
            >
              {/* Enhanced top-left dark shadow for depth */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "70%",
                  height: "70%",
                  background: isWinningScore
                    ? "linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 80%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 80%)",
                  borderRadius: isFirstSquare ? "12px 0 0 0" : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Enhanced bottom-right highlight */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "60%",
                  height: "60%",
                  background: isWinningScore
                    ? "linear-gradient(315deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 40%, transparent 70%)"
                    : "linear-gradient(315deg, rgba(148, 163, 184, 0.12) 0%, rgba(148, 163, 184, 0.04) 40%, transparent 70%)",
                  borderRadius: isLastSquare ? "0 0 12px 0" : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Subtle inner rim highlight */}
              <Box
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  right: "2px",
                  bottom: "2px",
                  border: isWinningScore
                    ? "1px solid rgba(34, 197, 94, 0.2)"
                    : "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: isFirstSquare
                    ? "10px 0 0 10px"
                    : isLastSquare
                      ? "0 10px 10px 0"
                      : "0",
                  pointerEvents: "none",
                }}
              />

              {/* Score number with better styling */}
              <Text
                size="xl"
                fw={700}
                c={isWinningScore ? "green.2" : "slate.3"}
                style={{
                  textShadow: isWinningScore
                    ? "0 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(34, 197, 94, 0.3)"
                    : "0 2px 4px rgba(0, 0, 0, 0.8)",
                  fontSize: "28px",
                  fontWeight: 800,
                  position: "absolute",
                  top: "12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  letterSpacing: "1px",
                }}
              >
                {score}
              </Text>

              {/* Faction control tokens */}
              {factionsAtScore.length > 0 && (
                <Box
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    zIndex: 2,
                  }}
                >
                  {factionsAtScore.map((faction, index) => (
                    <Box
                      key={index}
                      pos="relative"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      {/* Control token background */}
                      <Image
                        src="/control/control_gld.png"
                        style={{
                          width: "36px",
                          height: "36px",
                          filter:
                            "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.6)) brightness(1.1)",
                        }}
                      />
                      {/* Faction icon */}
                      <Image
                        src={faction.factionIcon}
                        style={{
                          width: "20px",
                          height: "20px",
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          filter:
                            "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.9)) brightness(1.05)",
                        }}
                      />
                    </Box>
                  ))}
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
