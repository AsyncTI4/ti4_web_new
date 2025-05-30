import {
  Paper,
  Group,
  Text,
  Grid,
  Stack,
  Box,
  Image,
  SimpleGrid,
} from "@mantine/core";

import { Relic } from "./PlayerArea/Relic";
import { Tech, PhantomTech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentStack } from "./PlayerArea/FragmentStack";
import { UnitCard } from "./PlayerArea/UnitCard";
import { ArmyStats } from "./PlayerArea/ArmyStats";
import { StrategyCardBanner } from "./PlayerArea/StrategyCardBanner";
import { Neighbors } from "./PlayerArea/Neighbors";
import { NeedsToFollow } from "./PlayerArea/NeedsToFollow";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { HeaderAccent } from "./PlayerArea/HeaderAccent";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { ResourceInfluenceTable } from "./PlayerArea/ResourceInfluenceTable";
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

export default function PlayerCard2(props: Props) {
  const {
    userName,
    faction,
    color,
    tacticalCC,
    fleetCC,
    strategicCC,
    fragments,
    isSpeaker,
    spaceArmyRes,
    groundArmyRes,
    spaceArmyHealth,
    groundArmyHealth,
    spaceArmyCombat,
    groundArmyCombat,

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

  // Count fragments by type
  const fragmentCounts = {
    cultural: fragments.filter((f: string) => f.startsWith("crf")).length,
    hazardous: fragments.filter((f: string) => f.startsWith("hrf")).length,
    industrial: fragments.filter(
      (f: string) => f.startsWith("irf") || f.startsWith("urf")
    ).length,
  };

  // Calculate planet economics properly
  const planetEconomics = calculatePlanetEconomics(
    planets,
    exhaustedPlanets,
    getPlanetData
  );

  const UnitsArea = (
    <Surface
      h="100%"
      p="md"
      w={{ base: "100%", sm: "fit-content" }}
      style={{
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <SimpleGrid h="100%" cols={{ base: 4, xl: 6 }} spacing="8px">
        {unitsOwned.map((unitId, index) => {
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
  );

  const RelicStack = (
    <Stack gap={4} w={{ base: "100%", sm: "fit-content" }}>
      {relics.map((relicId, index) => (
        <Relic key={index} relicId={relicId} />
      ))}
    </Stack>
  );

  const StrategyAndSpeaker = (
    <Group gap="xs" align="center">
      {scs.map((scNumber, index) => (
        <StrategyCardBanner
          key={scNumber}
          number={scNumber}
          text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
          color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
          isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
        />
      ))}
    </Group>
  );

  // Helper function to render techs with phantom slots
  const renderTechColumn = (techType: string, maxSlots: number = 4) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

    const techElements = filteredTechs.map((techId, index) => (
      <Tech key={index} techId={techId} />
    ));

    // Add phantom techs for remaining slots
    const remainingSlots = Math.max(0, maxSlots - filteredTechs.length);
    const phantomElements = Array.from(
      { length: remainingSlots },
      (_, index) => (
        <Box visibleFrom="md">
          <PhantomTech key={`phantom-${index}`} techType={techType} />
        </Box>
      )
    );

    return [...techElements, ...phantomElements];
  };

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

          <Group justify="space-between" align="center">
            <Group gap={4} px={4} align="center">
              {/* Small circular faction icon */}
              <Image
                src={cdnImage(`/factions/${faction}.png`)}
                alt={faction}
                w={24}
                h={24}
                style={{
                  filter:
                    "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
                }}
              />
              <Text
                span
                c="white"
                size="lg"
                ff="heading"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {userName}
              </Text>
              <Text
                size="md"
                span
                ml={4}
                opacity={0.9}
                c="white"
                ff="heading"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                [{faction}]
              </Text>
              <PlayerColor color={color} size="sm" />

              {/* Status Indicator - harmonized with Shimmer component styling */}
              {(props.playerData.passed || props.playerData.active) && (
                <Box
                  px={8}
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
                      fontSize: "10px",
                    }}
                  >
                    {props.playerData.passed ? "PASSED" : "ACTIVE"}
                  </Text>
                </Box>
              )}

              {/* Header s Section - harmonized with Surface component styling */}
              <Neighbors
                neighbors={props.playerData.neighbors || []}
                colorToFaction={props.colorToFaction}
              />
            </Group>

            {/* Strategy Card and Speaker Token */}
            <Box visibleFrom="sm">{StrategyAndSpeaker}</Box>
          </Group>
        </Box>
        <Grid gutter="md" columns={12}>
          <Grid.Col span={12} hiddenFrom="sm">
            {StrategyAndSpeaker}
          </Grid.Col>

          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            <PlayerCardCounts
              tg={props.playerData.tg || 0}
              commodities={props.playerData.commodities || 0}
              commoditiesTotal={props.playerData.commoditiesTotal || 0}
              soCount={props.playerData.soCount || 0}
              pnCount={props.playerData.pnCount || 0}
              acCount={props.playerData.acCount || 0}
            />
          </Grid.Col>
          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            <Leaders leaders={leaders} />
          </Grid.Col>
          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            <ScoredSecrets secretsScored={secretsScored} />
          </Grid.Col>
          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            <PromissoryNotesStack
              promissoryNotes={promissoryNotes}
              colorToFaction={props.colorToFaction}
            />
          </Grid.Col>

          <Grid.Col span={12} hiddenFrom="sm">
            {RelicStack}
          </Grid.Col>

          <Grid.Col span={2} visibleFrom="lg">
            <Stack h="100%">
              <PlayerCardCounts
                tg={props.playerData.tg || 0}
                commodities={props.playerData.commodities || 0}
                commoditiesTotal={props.playerData.commoditiesTotal || 0}
                soCount={props.playerData.soCount || 0}
                pnCount={props.playerData.pnCount || 0}
                acCount={props.playerData.acCount || 0}
              />

              <Group gap={0} align="stretch">
                {/* T/F/S Section - harmonized with Surface component styling */}
                <Stack gap={4} align="center">
                  <Text
                    ff="heading"
                    size="xs"
                    fw={600}
                    c="gray.4"
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "9px",
                      opacity: 0.8,
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CCs
                  </Text>
                  <Surface
                    p="sm"
                    h="100%"
                    style={{
                      borderRightWidth: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
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

                    <Stack
                      gap={2}
                      align="center"
                      justify="center"
                      pos="relative"
                      h="100%"
                      style={{ zIndex: 1 }}
                    >
                      <Text
                        ff="mono"
                        size="xs"
                        fw={600}
                        c="gray.3"
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        T/F/S
                      </Text>
                      <Text
                        ff="mono"
                        size="sm"
                        fw={600}
                        c="white"
                        style={{
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        {tacticalCC}/{fleetCC}/{strategicCC}
                      </Text>
                    </Stack>
                  </Surface>
                </Stack>
                {/* Fragments Section - harmonized with Surface component styling */}
                <Box flex={1}>
                  <Stack gap={4} align="center" h="100%" flex={1}>
                    <Text
                      ff="heading"
                      size="xs"
                      fw={600}
                      c="gray.4"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "9px",
                        opacity: 0.8,
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      Frags
                    </Text>
                    <Surface
                      p="sm"
                      pattern="grid"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        display: "flex",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Group gap="xs" justify="center" w="100%">
                        {fragmentCounts.cultural > 0 ||
                        fragmentCounts.hazardous > 0 ||
                        fragmentCounts.industrial > 0 ? (
                          <>
                            <FragmentStack
                              count={fragmentCounts.cultural}
                              type="crf"
                            />
                            <FragmentStack
                              count={fragmentCounts.hazardous}
                              type="hrf"
                            />
                            <FragmentStack
                              count={fragmentCounts.industrial}
                              type="urf"
                            />
                          </>
                        ) : (
                          <Text
                            size="xs"
                            c="gray.6"
                            style={{
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                              opacity: 0.5,
                            }}
                          >
                            No fragments
                          </Text>
                        )}
                      </Group>
                    </Surface>
                  </Stack>
                </Box>
              </Group>

              <ScoredSecrets secretsScored={secretsScored} />
              <PromissoryNotesStack
                promissoryNotes={promissoryNotes}
                colorToFaction={props.colorToFaction}
              />
              {/* Needs to Follow Section */}
              <NeedsToFollow values={props.playerData.unfollowedSCs || []} />
            </Stack>
          </Grid.Col>
          <Grid.Col
            span={{
              base: 12,
              lg: 10,
            }}
          >
            <Grid gutter="xs">
              <Grid.Col
                span={{
                  base: 12,
                  sm: 10,
                  lg: 9,
                }}
              >
                <Group gap={0} h="100%">
                  <Surface
                    flex={1}
                    pattern="grid"
                    cornerAccents={true}
                    label="TECH"
                    p="md"
                    h="100%"
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    <Stack>
                      <Grid gutter={4}>
                        <Grid.Col
                          span={{
                            base: 12,
                            md: 6,
                            xl: 3,
                          }}
                        >
                          <Stack gap={4}>
                            {renderTechColumn("PROPULSION")}
                          </Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 12,
                            md: 6,
                            xl: 3,
                          }}
                        >
                          <Stack gap={4}>
                            {renderTechColumn("CYBERNETIC")}
                          </Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 12,
                            md: 6,
                            xl: 3,
                          }}
                        >
                          <Stack gap={4}>{renderTechColumn("BIOTIC")}</Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={{
                            base: 12,
                            md: 6,
                            xl: 3,
                          }}
                        >
                          <Stack gap={4}>{renderTechColumn("WARFARE")}</Stack>
                        </Grid.Col>
                      </Grid>
                    </Stack>
                  </Surface>

                  <Box h="100%" visibleFrom="sm">
                    {UnitsArea}
                  </Box>
                </Group>
              </Grid.Col>
              <Grid.Col span={2} visibleFrom="lg">
                <Leaders leaders={leaders} />
              </Grid.Col>
              <Grid.Col span={12} hiddenFrom="sm">
                {UnitsArea}
              </Grid.Col>

              <Grid.Col
                visibleFrom="sm"
                span={{
                  sm: 2,
                  lg: 1,
                }}
                p="sm"
              >
                <ArmyStats
                  stats={{
                    spaceArmyRes,
                    groundArmyRes,
                    spaceArmyHealth,
                    groundArmyHealth,
                    spaceArmyCombat,
                    groundArmyCombat,
                  }}
                />
              </Grid.Col>
              <Grid.Col
                span={{
                  base: 12,
                  sm: 3,
                  lg: 3,
                  xl: 3,
                  xl2: 2,
                }}
              >
                <Surface
                  p="md"
                  pattern="none"
                  h="100%"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack>
                    {/* Total/Optimal Section */}
                    <ResourceInfluenceTable planetEconomics={planetEconomics} />

                    {/* Debt Section */}
                    {/* <DebtTokens debts={debts} /> */}
                  </Stack>
                </Surface>
              </Grid.Col>
              <Grid.Col
                span={{
                  base: 12,
                  sm: 6,
                  lg: 6,
                  xl: 6,
                  xl2: 7,
                }}
              >
                <Group h="100%">
                  <Surface
                    p="md"
                    pattern="circle"
                    cornerAccents={true}
                    label="Planets"
                    flex={1}
                    h="100%"
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
                </Group>
              </Grid.Col>
              <Grid.Col span={3} visibleFrom="sm">
                {/* Relics Column */}
                <Stack
                  gap={4}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "max-content",
                    justifyItems: "stretch",
                    width: "fit-content",
                  }}
                >
                  {RelicStack}
                </Stack>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
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

const getUnitAsyncId = (unitId: string) => {
  return units.find((u) => u.id === unitId)?.asyncId;
};
