import { Box, Group, Text, Image, SimpleGrid, Stack } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
import { Shimmer } from "./PlayerArea/Shimmer";
import { StrategyCard } from "./PlayerArea/StrategyCard";
import { StatusBadge } from "./PlayerArea/StatusBadge";

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

// Objective data
const STAGE_1_OBJECTIVES = [
  { text: "Develop Weaponry", vp: 1 },
  { text: "Explore Deep Space", vp: 1 },
  { text: "Intimidate Council", vp: 1 },
  { text: "Sway the Council", vp: 1 },
  { text: "Corner the Market", vp: 1 },
];

const STAGE_2_OBJECTIVES = [
  { text: "Command an Armada", vp: 2, revealed: true },
  { text: "Achieve Supremacy", vp: 2, revealed: true },
  { text: "<Unrevealed>", vp: 2, revealed: false },
  { text: "<Unrevealed>", vp: 2, revealed: false },
  { text: "<Unrevealed>", vp: 2, revealed: false },
];

const OTHER_OBJECTIVES = [
  { text: "Custodian/Imperial", vp: 1 },
  { text: "Threaten Enemies", vp: 1 },
];

// Faction icons for current game
const CURRENT_GAME_FACTIONS = [
  "/factions/yin.png",
  "/factions/xxcha.png",
  "/factions/letnev.png",
  "/factions/empyrean.png",
  "/factions/titans.png",
  "/factions/saar.png",
  "/factions/sol.png",
];

// Objective card component similar to ScoredSecret
function ObjectiveCard({
  text,
  vp,
  color,
  revealed = true,
}: {
  text: string;
  vp: number;
  color: "orange" | "blue" | "gray";
  revealed?: boolean;
}) {
  return (
    <Shimmer
      color={color}
      p={2}
      px="sm"
      style={{ opacity: revealed ? 1 : 0.6, position: "relative" }}
    >
      <Box
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
          minHeight: "32px", // Ensure enough height for control tokens
        }}
      >
        {/* VP indicator */}
        <Box
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: revealed
              ? "1px solid rgba(255, 215, 0, 0.6)"
              : "1px solid rgba(100, 100, 100, 0.4)",
            borderWidth: "2px",
          }}
        >
          <Text size="lg" fw={900} c={revealed ? "white" : "gray.5"}>
            {vp}
          </Text>
        </Box>

        {/* Objective text */}
        <Text
          size="sm"
          ff="heading"
          c={revealed ? "white" : "gray.4"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: 1,
            // fontSize: "12px",
          }}
        >
          {text}
        </Text>

        {/* Control token area */}
        <Box
          style={{
            display: "flex",
            gap: "2px",
            alignItems: "center",
            flexShrink: 0,
            minWidth: "120px", // Space for 6 tokens with minimal spacing
            height: "20px",
            justifyContent: "flex-end",
          }}
        >
          {/* Placeholder for control tokens - you can add actual tokens here */}
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={i}
              style={{
                width: "18px",
                height: "18px",
                border: "2px dashed rgba(255, 255, 255, 0.4)",
                borderRadius: "50%",
                opacity: 0.6,
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />
          ))}
        </Box>
      </Box>
    </Shimmer>
  );
}

// Law component similar to ScoredSecret but larger and yellow-themed
function LawCard({ title }: { title: string }) {
  return (
    <Box
      p="xs"
      px="sm"
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
            size="md"
            ff="heading"
            fw={600}
            c="slate.2"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.6)",
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
      p="lg"
      pattern="grid"
      cornerAccents={true}
      // label="SCOREBOARD"
      style={{
        width: "100vw",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)",
      }}
    >
      {/* Game Status Section */}
      <Box mb="lg">
        <SimpleGrid cols={3} spacing="lg">
          {/* Unpicked Strategy Cards */}
          <Box>
            <Text
              size="sm"
              fw={600}
              c="gray.5"
              mb="sm"
              style={{
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "12px",
              }}
            >
              Unpicked SCs
            </Text>
            <Group gap="sm">
              <StrategyCard number={4} name="CONSTRUCTION" color="green" />
              <StrategyCard number={7} name="TECHNOLOGY" color="blue" />
            </Group>
          </Box>

          {/* Card Pool */}
          <Box>
            <Text
              size="sm"
              fw={600}
              c="gray.5"
              mb="sm"
              style={{
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "12px",
              }}
            >
              Card Pool
            </Text>
            {/* Empty for now */}
          </Box>

          {/* Current Game Factions */}
          <Box>
            <Text
              size="sm"
              fw={600}
              c="gray.5"
              mb="sm"
              style={{
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "12px",
              }}
            >
              Factions in Game
            </Text>
            <Group gap="md">
              {CURRENT_GAME_FACTIONS.map((factionIcon, index) => {
                // Determine if this faction should have a status badge
                let statusBadge = null;
                if (index === 0) {
                  // YIN (first faction)
                  statusBadge = <StatusBadge status="active" />;
                } else if (index === 1) {
                  // XXCHA (second faction)
                  statusBadge = <StatusBadge status="next" />;
                }

                return (
                  <Stack key={index} gap="xs" align="center">
                    <Image
                      src={factionIcon}
                      w={40}
                      h={40}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                    {statusBadge}
                  </Stack>
                );
              })}
            </Group>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Divider */}
      <Box
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%)",
          margin: "16px 0",
        }}
      />

      {/* Laws in Play Section */}
      <Box mb="lg">
        <Text
          size="sm"
          fw={600}
          c="gray.5"
          mb="sm"
          style={{
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "12px",
          }}
        >
          Laws in Play
        </Text>
        <SimpleGrid cols={2} spacing="sm">
          {LAWS_IN_PLAY.map((law, index) => (
            <LawCard key={index} title={law} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Divider */}
      <Box
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%)",
          margin: "16px 0",
        }}
      />

      {/* Scorable Objectives Section */}
      <Box mb="lg">
        <Text
          size="sm"
          fw={600}
          c="gray.5"
          mb="sm"
          style={{
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "12px",
          }}
        >
          Public Objectives
        </Text>
        <SimpleGrid cols={3} spacing="md">
          {/* Stage I Objectives (Orange) */}
          <Box
            style={{
              background: "rgba(249, 115, 22, 0.04)",
              border: "1px solid rgba(249, 115, 22, 0.1)",
              borderRadius: "6px",
              padding: "8px",
            }}
          >
            <Text
              size="md"
              fw={600}
              c="orange.3"
              mb="xs"
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "14px",
              }}
            >
              Stage I
            </Text>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              {STAGE_1_OBJECTIVES.map((objective, index) => (
                <ObjectiveCard
                  key={index}
                  text={objective.text}
                  vp={objective.vp}
                  color="orange"
                />
              ))}
            </Box>
          </Box>

          {/* Stage II Objectives (Blue) */}
          <Box
            style={{
              background: "rgba(59, 130, 246, 0.04)",
              border: "1px solid rgba(59, 130, 246, 0.1)",
              borderRadius: "6px",
              padding: "8px",
            }}
          >
            <Text
              size="md"
              fw={600}
              c="blue.3"
              mb="xs"
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "14px",
              }}
            >
              Stage II
            </Text>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              {STAGE_2_OBJECTIVES.map((objective, index) => (
                <ObjectiveCard
                  key={index}
                  text={objective.text}
                  vp={objective.vp}
                  color="blue"
                  revealed={objective.revealed}
                />
              ))}
            </Box>
          </Box>

          {/* Other Objectives (Gray) */}
          <Box>
            <Text
              size="md"
              fw={600}
              c="gray.3"
              mb="xs"
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "14px",
              }}
            >
              Other
            </Text>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              {OTHER_OBJECTIVES.map((objective, index) => (
                <ObjectiveCard
                  key={index}
                  text={objective.text}
                  vp={objective.vp}
                  color="gray"
                />
              ))}
            </Box>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Score Tracker */}
      <Box
        style={{
          display: "flex",
          width: "100%",
          height: "80px",
          overflow: "visible",
          padding: "6px 0",
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
                borderLeft: isFirstSquare ? undefined : "none",
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
                  textShadow: isWinningScore
                    ? "0 1px 3px rgba(0, 0, 0, 0.8), 0 0 8px rgba(34, 197, 94, 0.4)"
                    : "0 1px 3px rgba(0, 0, 0, 0.8), 0 0 4px rgba(148, 163, 184, 0.3)",
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
                        height: "26px",
                      }}
                    >
                      {/* Control token background */}
                      <Image
                        src="/control/control_gld.png"
                        style={{
                          // width: "26px",
                          height: "26px",
                          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))",
                        }}
                      />
                      {/* Faction icon */}
                      <Image
                        src={faction.factionIcon}
                        style={{
                          width: "26px",
                          height: "26px",
                          position: "absolute",
                          top: 0,
                          left: 6,
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
