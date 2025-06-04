import {
  Paper,
  Group,
  Text,
  Stack,
  Box,
  Image,
  SimpleGrid,
} from "@mantine/core";

import { Relic } from "./PlayerArea/Relic";
import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard } from "./PlayerArea/UnitCard";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { HeaderAccent } from "./PlayerArea/HeaderAccent";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { ResourceInfluenceTable } from "./PlayerArea/ResourceInfluenceTable";
import { CCPool } from "./PlayerArea/CCPool";
import { techs as techsData } from "../data/tech";
import { planets } from "../data/planets";
import { PlayerData } from "../data/pbd10242";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { units } from "../data/units";

// Helper function to get tech data by ID
const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
};

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

// Strategy card names and colors mapping
const SC_NAMES = {
  1: "LEADERSHIP",
  2: "DIPLOMACY",
  3: "POLITICS",
  4: "CONSTRUCTION",
  5: "TRADE",
  6: "WARFARE",
  7: "TECHNOLOGY",
  8: "IMPERIAL",
};

const SC_COLORS = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "green",
  5: "teal",
  6: "cyan",
  7: "blue",
  8: "purple",
};

type Props = {
  playerData: PlayerData;
  colorToFaction: Record<string, string>;
};

const getUnitAsyncId = (unitId: string) => {
  return units.find((u) => u.id === unitId)?.asyncId;
};

// Helper function to get unit data by ID
const getUnitData = (unitId: string) => {
  return units.find((unit) => unit.id === unitId);
};

// Helper function to check if a unit is upgraded
const isUnitUpgraded = (unitId: string) => {
  const unitData = getUnitData(unitId);
  return unitData?.upgradesFromUnitId !== undefined;
};

export default function PlayerCardCompact(props: Props) {
  const {
    userName,
    faction,
    color,
    tacticalCC,
    fleetCC,
    strategicCC,
    fragments,
    isSpeaker,

    techs,
    relics,
    planets,
    secretsScored,
    unitsOwned,
    leaders,
  } = props.playerData;

  // Get strategy cards from player data, fallback to [1] for demo
  const scs = props.playerData.scs || [3, 4];

  // Use promissoryNotesInPlayArea from PlayerData
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];

  // Get exhaustedPlanets from PlayerData
  const exhaustedPlanets = props.playerData.exhaustedPlanets || [];

  // Filter units to only show upgraded ones
  const upgradedUnits = unitsOwned.filter(isUnitUpgraded);

  // Calculate planet economics properly
  const planetEconomics = calculatePlanetEconomics(
    planets,
    exhaustedPlanets,
    getPlanetData
  );

  const renderTechColumn = (techType: string) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

    const techElements = filteredTechs.map((techId, index) => (
      <Tech key={index} techId={techId} />
    ));

    return techElements;
  };

  const FragmentsAndCCSection = (
    <Group gap={0} align="stretch">
      {/* T/F/S Section - harmonized with Surface component styling */}
      <CCPool
        tacticalCC={tacticalCC}
        fleetCC={fleetCC}
        strategicCC={strategicCC}
      />
      {/* Fragments Section - harmonized with Surface component styling */}
      <FragmentsPool fragments={fragments} />
    </Group>
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
        "@keyframes shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },

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
              w="100%"
              align="center"
              wrap="nowrap"
              justify="space-between"
              style={{ minWidth: 0 }}
            >
              <Group gap={4}>
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

                {/* Status Indicator - harmonized with Shimmer component styling */}
                {(props.playerData.passed || props.playerData.active) && (
                  <Box
                    px={6}
                    py={2}
                    ml={4}
                    style={{
                      borderRadius: "6px",
                      background: props.playerData.passed
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.06) 100%)"
                        : "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.06) 100%)",
                      border: props.playerData.passed
                        ? "1px solid rgba(239, 68, 68, 0.25)"
                        : "1px solid rgba(34, 197, 94, 0.25)",
                      boxShadow: props.playerData.passed
                        ? "0 2px 8px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                        : "0 2px 8px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      size="xs"
                      fw={700}
                      c={props.playerData.passed ? "red.3" : "green.3"}
                      style={{
                        textTransform: "uppercase",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        letterSpacing: "0.5px",
                        fontSize: "9px",
                      }}
                    >
                      {props.playerData.passed ? "PASSED" : "ACTIVE"}
                    </Text>
                  </Box>
                )}
              </Group>

              {scs.map((scNumber, index) => (
                <StrategyCardBannerCompact
                  key={scNumber}
                  number={scNumber}
                  text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
                  color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
                  isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
                />
              ))}
            </Group>
          </Group>
        </Box>

        {/* Main Content - Simplified Grid for narrow layout */}
        <Stack gap="md">
          {/* Top Row - Cards/Stats */}
          <SimpleGrid cols={2} spacing="xs">
            <PlayerCardCounts
              tg={props.playerData.tg || 0}
              commodities={props.playerData.commodities || 0}
              commoditiesTotal={props.playerData.commoditiesTotal || 0}
              soCount={props.playerData.soCount || 0}
              pnCount={props.playerData.pnCount || 0}
              acCount={props.playerData.acCount || 0}
            />
            <Leaders leaders={leaders} />
          </SimpleGrid>

          <SimpleGrid cols={2} spacing="xs">
            <ScoredSecrets secretsScored={secretsScored} />
            <PromissoryNotesStack
              promissoryNotes={promissoryNotes}
              colorToFaction={props.colorToFaction}
            />
            {/* Fragments and CC Section */}
            {FragmentsAndCCSection}
            {/* Relics */}
            <Group gap={4} wrap="wrap">
              {relics.map((relicId, index) => (
                <Relic key={index} relicId={relicId} />
              ))}
            </Group>
          </SimpleGrid>

          {/* Tech Section - Simplified for narrow layout */}
          <Surface pattern="grid" cornerAccents={true} label="TECH" p="md">
            <Stack gap="xs">
              <SimpleGrid cols={2} spacing="xs">
                <Stack gap={4}>{renderTechColumn("PROPULSION")}</Stack>
                <Stack gap={4}>{renderTechColumn("CYBERNETIC")}</Stack>
              </SimpleGrid>
              <SimpleGrid cols={2} spacing="xs">
                <Stack gap={4}>{renderTechColumn("BIOTIC")}</Stack>
                <Stack gap={4}>{renderTechColumn("WARFARE")}</Stack>
              </SimpleGrid>
            </Stack>
          </Surface>

          {/* Units Section - Only show upgraded units */}
          {upgradedUnits.length > 0 && (
            <Surface p="md" label="UPGRADED UNITS">
              <SimpleGrid cols={4} spacing="8px">
                {upgradedUnits.map((unitId, index) => {
                  const asyncId = getUnitAsyncId(unitId);
                  const deployedCount = asyncId
                    ? (props.playerData.unitCounts[asyncId].deployedCount ?? 0)
                    : 0;

                  return (
                    <UnitCard
                      key={index}
                      unitId={unitId}
                      color={color}
                      deployedCount={deployedCount}
                    />
                  );
                })}
              </SimpleGrid>
            </Surface>
          )}

          {/* Resources and Planets Section */}
          <Stack gap="xs">
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

            <Surface
              p="md"
              pattern="circle"
              cornerAccents={true}
              label="Planets"
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
        </Stack>
      </Box>

      {/* Faction background image - harmonized with consistent opacity and positioning */}
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
