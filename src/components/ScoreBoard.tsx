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
        }}
      >
        {scorePositions.map((score, index) => {
          const factionsAtScore = factionsByScore[score] || [];
          const isWinningScore = score === 10;
          const isFirstSquare = index === 0;
          const isLastSquare = index === scorePositions.length - 1;

          return (
            <Shimmer
              key={score}
              color={isWinningScore ? "green" : "blue"}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: isWinningScore
                  ? "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)",
                border: isWinningScore
                  ? "2px solid rgba(34, 197, 94, 0.4)"
                  : "1px solid rgba(59, 130, 246, 0.25)",
                borderLeft: isFirstSquare ? undefined : "none",
                borderRadius: isFirstSquare
                  ? "8px 0 0 8px"
                  : isLastSquare
                    ? "0 8px 8px 0"
                    : "0",
                boxShadow: isWinningScore
                  ? "0 4px 16px rgba(34, 197, 94, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.1)"
                  : "0 2px 8px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Score number */}
              <Text
                size="xl"
                fw={700}
                c={isWinningScore ? "green.3" : "blue.3"}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  fontSize: "24px",
                  position: "absolute",
                  top: "8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                }}
              >
                {score}
              </Text>

              {/* Faction control tokens */}
              {factionsAtScore.length > 0 && (
                <Box
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {factionsAtScore.map((faction, index) => (
                    <Box
                      key={index}
                      pos="relative"
                      style={{
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      {/* Control token background */}
                      <Image
                        src="/control/control_gld.png"
                        style={{
                          width: "32px",
                          height: "32px",
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))",
                        }}
                      />
                      {/* Faction icon */}
                      <Image
                        src={faction.factionIcon}
                        style={{
                          width: "18px",
                          height: "18px",
                          position: "absolute",
                          top: "7px",
                          left: "7px",
                          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Special effects for winning score */}
              {isWinningScore && (
                <>
                  {/* Pulsing glow effect */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "-2px",
                      left: "-2px",
                      right: "-2px",
                      bottom: "-2px",
                      background:
                        "linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.2))",
                      borderRadius: "inherit",
                      animation: "scoreboardPulse 2s ease-in-out infinite",
                      zIndex: -1,
                    }}
                  />

                  {/* Victory crown or star indicator */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "20px",
                      height: "20px",
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 193, 7, 0.8) 100%)",
                      borderRadius: "50%",
                      border: "2px solid rgba(255, 215, 0, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                      zIndex: 3,
                    }}
                  >
                    <Text
                      size="xs"
                      fw={700}
                      c="yellow.9"
                      style={{
                        fontSize: "10px",
                        textShadow: "0 1px 1px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      ★
                    </Text>
                  </Box>
                </>
              )}

              {/* Subtle inner pattern for empty squares */}
              {factionsAtScore.length === 0 && (
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40px",
                    height: "40px",
                    border: "1px dashed rgba(148, 163, 184, 0.2)",
                    borderRadius: "50%",
                    opacity: 0.3,
                  }}
                />
              )}
            </Shimmer>
          );
        })}
      </Box>

      {/* Global styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes scoreboardPulse {
            0%, 100% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.02);
            }
          }
        `,
        }}
      />
    </Surface>
  );
}

export default ScoreBoard;
