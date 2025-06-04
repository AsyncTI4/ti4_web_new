import { Paper, Text, Stack, Box, Image, Group } from "@mantine/core";

import { Surface } from "./PlayerArea/Surface";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { HeaderAccent } from "./PlayerArea/HeaderAccent";
import { ResourceInfluenceTable } from "./PlayerArea/ResourceInfluenceTable";
import { planets } from "../data/planets";
import { PlayerData } from "../data/pbd10242";
import { cdnImage } from "../data/cdnImage";

// Helper function to get planet data by ID
const getPlanetData = (planetId: string) => {
  return (planets as any)[planetId];
};

// Helper function to calculate planet economics
const calculatePlanetEconomics = (
  planets: string[],
  exhaustedPlanets: string[],
  getPlanetData: (planetId: string) => any
) => {
  return planets.reduce(
    (acc, planetId) => {
      const planetData = getPlanetData(planetId);
      if (!planetData) return acc;

      const isExhausted = exhaustedPlanets.includes(planetId);
      const resources = planetData.resources;
      const influence = planetData.influence;

      // Check if this is a flex planet (equal resources and influence)
      const isFlex = resources === influence && resources > 0;

      if (isFlex) {
        // Flex planets only count towards flex totals
        acc.flex.totalFlex += resources; // Use resources value since they're equal
        if (!isExhausted) {
          acc.flex.currentFlex += resources;
        }
      } else {
        // Non-flex planets count towards total always
        acc.total.totalResources += resources;
        acc.total.totalInfluence += influence;

        // Add to current if not exhausted
        if (!isExhausted) {
          acc.total.currentResources += resources;
          acc.total.currentInfluence += influence;
        }

        // Optimal calculation for non-flex planets
        if (resources > influence) {
          acc.optimal.totalResources += resources;
          if (!isExhausted) acc.optimal.currentResources += resources;
        } else if (influence > resources) {
          acc.optimal.totalInfluence += influence;
          if (!isExhausted) acc.optimal.currentInfluence += influence;
        }
        // Note: We don't handle the equal case here since it's already handled as flex
      }

      return acc;
    },
    {
      total: {
        currentResources: 0,
        totalResources: 0,
        currentInfluence: 0,
        totalInfluence: 0,
      },
      optimal: {
        currentResources: 0,
        totalResources: 0,
        currentInfluence: 0,
        totalInfluence: 0,
      },
      flex: {
        currentFlex: 0,
        totalFlex: 0,
      },
    }
  );
};

type Props = {
  playerData: PlayerData;
};

export default function ResourcesPlayerCard(props: Props) {
  const { userName, faction, color, planets } = props.playerData;

  // Get exhaustedPlanets from PlayerData
  const exhaustedPlanets = props.playerData.exhaustedPlanets || [];

  // Calculate planet economics properly
  const planetEconomics = calculatePlanetEconomics(
    planets,
    exhaustedPlanets,
    getPlanetData
  );

  return (
    <Paper
      p="sm"
      m={5}
      pos="relative"
      style={{
        maxWidth: "100%",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        overflow: "hidden",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
        filter: props.playerData.passed
          ? "brightness(0.9) saturate(0.4)"
          : "none",
      }}
      radius="md"
    >
      {/* Subtle inner glow */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(148, 163, 184, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box pos="relative" style={{ zIndex: 1 }}>
        {/* Header Section */}
        <Box
          p="sm"
          mb="lg"
          pos="relative"
          mt={-16}
          ml={-16}
          mr={-8}
          style={{
            borderRadius: 0,
            borderBottomRightRadius: 8,
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(30, 41, 59, 0.95) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            overflow: "hidden",
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(148, 163, 184, 0.15)",
            opacity: props.playerData.passed ? 0.9 : 1,
          }}
        >
          {/* Header bottom border accent */}
          <HeaderAccent color={color} />

          <Group justify="space-between" align="center" wrap="nowrap">
            <Group
              gap={4}
              px={4}
              align="center"
              wrap="nowrap"
              style={{ minWidth: 0 }}
            >
              {/* Small circular faction icon */}
              <Image
                src={cdnImage(`/factions/${faction}.png`)}
                alt={faction}
                w={24}
                h={24}
                style={{
                  filter:
                    "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
                  flexShrink: 0,
                }}
              />
              <Text
                span
                c="white"
                size="sm"
                ff="heading"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </Text>
              <Text
                size="xs"
                span
                ml={4}
                opacity={0.9}
                c="white"
                ff="heading"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  flexShrink: 0,
                }}
              >
                [{faction}]
              </Text>
              <PlayerColor color={color} size="sm" />
            </Group>
          </Group>
        </Box>

        {/* Main Content */}
        <Stack gap="md">
          {/* Resource/Influence Totals Section */}
          <Surface
            p="md"
            pattern="none"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ResourceInfluenceTable planetEconomics={planetEconomics} />
          </Surface>

          {/* Planets Section */}
          <Surface
            p="md"
            pattern="circle"
            cornerAccents={true}
            label="PLANETS"
            style={{
              alignItems: "flex-start",
            }}
          >
            <Group gap="xs" pos="relative" style={{ zIndex: 1 }}>
              {planets.map((planetId, index) => (
                <PlanetCard
                  key={index}
                  planetId={planetId}
                  exhausted={exhaustedPlanets.includes(planetId)}
                />
              ))}
            </Group>
          </Surface>
        </Stack>
      </Box>

      {/* Faction background image */}
      <Box
        pos="absolute"
        bottom={-60}
        right={-40}
        opacity={0.05}
        h={250}
        style={{
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          filter: "grayscale(0.2)",
        }}
      >
        <Image
          src={cdnImage(`/factions/${faction}.png`)}
          alt="faction"
          w="100%"
          h="100%"
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Paper>
  );
}
