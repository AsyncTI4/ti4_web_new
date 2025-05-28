import { Box, Group, Text, Image, SimpleGrid } from "@mantine/core";
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

// Laws data for demonstration
const LAWS_IN_PLAY = [
  "Regulated Conscription",
  "Classified Document Leaks",
  "Minister of Exploration",
  "Minister of Peace",
  "Shared Research",
];

// Law component similar to ScoredSecret but larger and yellow-themed
function LawCard({ title }: { title: string }) {
  return (
    <Box
      p="sm"
      px="md"
      style={{
        background: "rgba(148, 163, 184, 0.08",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        position: "relative",
      }}
    >
      <Box
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: 0,
        }}
      >
        {/* Law gavel badge in top right - more prominent icon, less prominent circle */}
        <Box
          style={{
            position: "absolute",
            right: "-10px",
            width: "40px",
            height: "40px",
            background:
              "linear-gradient(145deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          <Text
            style={{
              fontSize: "28px",
              lineHeight: 1,
            }}
          >
            ⚖
          </Text>
        </Box>

        {/* Administrative badge/seal background for faction icon */}
        <Box
          style={{
            width: "40px",
            height: "40px",
            background:
              "linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            zIndex: 1,
            boxShadow:
              "inset 1px 1px 2px rgba(0, 0, 0, 0.5), inset -1px -1px 1px rgba(148, 163, 184, 0.05)",
          }}
        >
          <Image
            src="/factions/saar.png"
            style={{
              width: "24px",
              height: "24px",
              filter:
                "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6)) brightness(1.05)",
            }}
          />
        </Box>

        {/* Administrative text background */}
        <Box
          style={{
            flex: 1,
            background:
              "linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(15, 23, 42, 0.85) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "3px",
            padding: "6px 12px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Subtle administrative pattern */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  rgba(148, 163, 184, 0.015) 0px,
                  rgba(148, 163, 184, 0.015) 1px,
                  transparent 1px,
                  transparent 12px
                ),
                repeating-linear-gradient(
                  -45deg,
                  rgba(148, 163, 184, 0.008) 0px,
                  rgba(148, 163, 184, 0.008) 1px,
                  transparent 1px,
                  transparent 24px
                )
              `,
              pointerEvents: "none",
              opacity: 0.4,
            }}
          />

          <Text
            size="sm"
            fw={600}
            c="slate.2"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.6)",
              fontSize: "13px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              position: "relative",
              zIndex: 1,
            }}
          >
            {title}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

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
      {/* Laws in Play Section */}
      <Box mb="xl">
        <Text
          size="lg"
          fw={700}
          c="yellow.3"
          mb="md"
          style={{
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Laws in Play
        </Text>
        <SimpleGrid cols={2} spacing="md">
          {LAWS_IN_PLAY.map((law, index) => (
            <LawCard key={index} title={law} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Score Tracker */}
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
                  ? "4px 0 0 4px"
                  : isLastSquare
                    ? "0 4px 4px 0"
                    : "0",
                background: isWinningScore
                  ? "rgba(34, 197, 94, 0.12)"
                  : "rgba(148, 163, 184, 0.08)",
                border: isWinningScore
                  ? "1px solid rgba(34, 197, 94, 0.3)"
                  : "1px solid rgba(148, 163, 184, 0.2)",
                borderLeft: isFirstSquare
                  ? undefined
                  : isWinningScore
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(148, 163, 184, 0.2)",
                overflow: "visible",
                transition: "all 0.3s ease",
              }}
            >
              {/* Score number */}
              <Text
                size="lg"
                fw={700}
                ff="heading"
                c={isWinningScore ? "green.2" : "slate.2"}
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  position: "absolute",
                  top: "6px",
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
                    bottom: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    zIndex: 2,
                    maxHeight: "60px",
                    overflow: "visible",
                  }}
                >
                  {factionsAtScore.slice(0, 2).map((faction, index) => (
                    <Box
                      key={index}
                      pos="relative"
                      style={{
                        width: "26px",
                        height: "26px",
                      }}
                    >
                      {/* Control token background */}
                      <Image
                        src="/control/control_gld.png"
                        style={{
                          width: "26px",
                          height: "26px",
                          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))",
                        }}
                      />
                      {/* Faction icon */}
                      <Image
                        src={faction.factionIcon}
                        style={{
                          width: "14px",
                          height: "14px",
                          position: "absolute",
                          top: "6px",
                          left: "6px",
                          filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6))",
                        }}
                      />
                    </Box>
                  ))}
                  {/* Show count if more than 2 factions */}
                  {factionsAtScore.length > 2 && (
                    <Text
                      size="xs"
                      fw={600}
                      c="yellow.3"
                      style={{
                        fontSize: "9px",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "6px",
                        padding: "1px 3px",
                      }}
                    >
                      +{factionsAtScore.length - 2}
                    </Text>
                  )}
                </Box>
              )}

              {/* Special effects for winning score */}
              {isWinningScore && (
                <>
                  {/* Victory crown */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "24px",
                      height: "24px",
                      background: "rgba(34, 197, 94, 0.9)",
                      borderRadius: "50%",
                      border: "1px solid rgba(34, 197, 94, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 4,
                    }}
                  >
                    <Text
                      size="sm"
                      fw={700}
                      c="white"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      ★
                    </Text>
                  </Box>
                </>
              )}

              {/* Empty square indicator */}
              {factionsAtScore.length === 0 && (
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "24px",
                    height: "24px",
                    border: "1px dashed rgba(148, 163, 184, 0.3)",
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
    </Surface>
  );
}

export default ScoreBoard;
