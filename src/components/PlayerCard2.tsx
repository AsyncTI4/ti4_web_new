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
import { Caption } from "./PlayerArea/Caption";
import { ResourceInfluenceDisplay } from "./PlayerArea/ResourceInfluenceDisplay";
import { Relic } from "./PlayerArea/Relic";
import { Tech, PhantomTech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { Cardback } from "./PlayerArea/Cardback";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { Leader } from "./PlayerArea/Leader";
import { PromissoryNote } from "./PlayerArea/PromissoryNote";
import { EmptyPromissoryNotePlaceholder } from "./PlayerArea/PromissoryNote";
import { ScoredSecret } from "./PlayerArea/ScoredSecret";
import { EmptyScoredSecretsPlaceholder } from "./PlayerArea/ScoredSecret";
import { FragmentStack } from "./PlayerArea/FragmentStack";
import { UnitCard } from "./PlayerArea/UnitCard";
import { ArmyStats } from "./PlayerArea/ArmyStats";
import { StrategyCardBanner } from "./PlayerArea/StrategyCardBanner";
import { Neighbors } from "./PlayerArea/Neighbors";
import { PlanetTraitIcon } from "./PlayerArea/PlanetTraitIcon";
import { NeedsToFollow } from "./PlayerArea/NeedsToFollow";
import { getGradientClasses, ColorKey } from "./PlayerArea/gradientClasses";
import { techs as techsData } from "../data/tech";
import { planets } from "../data/planets";
import { secretObjectives } from "../data/secretObjectives";
import { PlayerData, pbdPlayerData } from "../data/pbd10242";

// Helper function to get header gradient class from color
const getHeaderGradientClass = (color: string): string => {
  const gradientClasses = getGradientClasses(color as ColorKey);
  return gradientClasses.shimmer;
};

// Helper function to get tech data by ID
const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
};

// Helper function to get planet data by ID
const getPlanetData = (planetId: string) => {
  return (planets as any)[planetId];
};

// Helper function to get secret objective data by alias
const getSecretObjectiveData = (alias: string) => {
  return secretObjectives.find((secret) => secret.alias === alias);
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

      // Always add to totals
      acc.total.totalResources += resources;
      acc.total.totalInfluence += influence;

      // Add to current if not exhausted
      if (!isExhausted) {
        acc.total.currentResources += resources;
        acc.total.currentInfluence += influence;
      }

      // Optimal calculation with early returns
      const addOptimalResources = (amount: number) => {
        acc.optimal.totalResources += amount;
        if (!isExhausted) acc.optimal.currentResources += amount;
      };

      const addOptimalInfluence = (amount: number) => {
        acc.optimal.totalInfluence += amount;
        if (!isExhausted) acc.optimal.currentInfluence += amount;
      };

      // Guard clause: resources higher
      if (resources > influence) {
        addOptimalResources(resources);
        return acc;
      }

      // Guard clause: influence higher
      if (influence > resources) {
        addOptimalInfluence(influence);
        return acc;
      }

      // Default case: equal values, split the difference
      const halfValue = resources / 2;
      addOptimalResources(halfValue);
      addOptimalInfluence(halfValue);

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
    }
  );
};

// Default player card data including all static and default prop data
const DEFAULT_PLAYER_CARD_DATA = {
  faction: "Federation of Sol",
  color: "blue",
  tactics: 1,
  fleet: 4,
  strategy: 2,

  needsToFollow: {
    blue: 2,
    green: 4,
    violet: 8,
  },
  hasPassed: false,
  hasSpeaker: true,
  armyStats: {
    spaceHealth: 8,
    groundHealth: 12,
    spaceHit: 4,
    groundHit: 6,
    spaceUnits: 2,
    groundUnits: 3,
  },
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
};
export default function PlayerCard2(props: Props) {
  const {
    userName,
    faction,
    color,
    tactics,
    fleet,
    strategy,
    fragments,
    needsToFollow,

    hasSpeaker,
    armyStats,

    techs,
    relics,
    planets,
    secretsScored,
    unitsOwned,
    leaders,
  } = { ...DEFAULT_PLAYER_CARD_DATA, ...props.playerData };

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

  const totalResources = planetEconomics.total.totalResources;
  const totalInfluence = planetEconomics.total.totalInfluence;

  const techSkipIcons = {
    biotic: <Image src={`/green.png`} alt="biotic" w={16} h={16} />,
    propulsion: <Image src={`/blue.png`} alt="propulsion" w={16} h={16} />,
    cybernetic: <Image src={`/yellow.png`} alt="cybernetic" w={16} h={16} />,
    warfare: <Image src={`/red.png`} alt="warfare" w={16} h={16} />,
  };

  const LeaderStack = (
    <Stack gap={4} style={{ overflow: "hidden" }}>
      {leaders.map((leader, index) => (
        <Leader
          key={index}
          id={leader.id}
          type={leader.type as "agent" | "commander" | "hero"}
          tgCount={leader.tgCount}
          exhausted={leader.exhausted}
          locked={leader.locked}
          active={leader.active}
        />
      ))}
    </Stack>
  );

  const CardbackStack = (
    <Group gap={6} justify="center">
      {[
        {
          src: "/cardback/cardback_so.png",
          alt: "secret objectives",
          count: 0, // Mock data as requested
        },
        {
          src: "/cardback/cardback_action.png",
          alt: "action cards",
          count: 4, // Mock data as requested
        },
        {
          src: "/cardback/cardback_pn.png",
          alt: "promissory notes",
          count: 7, // Mock data as requested
        },
        {
          src: "/cardback/cardback_tg.png",
          alt: "trade goods",
          count: props.playerData.tg || 0,
        },
        {
          src: "/cardback/cardback_comms.png",
          alt: "commodities",
          count: `${props.playerData.commodities || 0}/${props.playerData.commoditiesTotal || 0}`,
        },
      ].map((cardback, index) => (
        <Cardback
          key={index}
          src={cardback.src}
          alt={cardback.alt}
          count={cardback.count}
        />
      ))}
    </Group>
  );

  const PromissoryNoteStack = (
    <Stack gap={4}>
      {promissoryNotes.length > 0 ? (
        promissoryNotes.map((noteId, index) => (
          <PromissoryNote key={index} promissoryNoteId={noteId} />
        ))
      ) : (
        <EmptyPromissoryNotePlaceholder />
      )}
    </Stack>
  );

  const ScoredSecretStack = (
    <Stack gap={2}>
      {Object.values(secretsScored).length > 0 ? (
        Object.entries(secretsScored).map(([secretId, score]) => (
          <ScoredSecret key={secretId} secretId={secretId} score={score} />
        ))
      ) : (
        <EmptyScoredSecretsPlaceholder />
      )}
    </Stack>
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
        {unitsOwned.map((unitId, index) => (
          <UnitCard key={index} unitId={unitId} maxReinforcements={8} />
        ))}
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
          hasSpeaker={index === 0 && hasSpeaker} // Only show speaker on first card
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
          <Box
            pos="absolute"
            bottom={0}
            left={0}
            right={0}
            h={8}
            className={getHeaderGradientClass(color as ColorKey)}
          />

          <Group justify="space-between" align="center">
            <Group gap={4} px={4} align="center">
              {/* Small circular faction icon */}
              <Image
                src={`/factions/${faction.toLowerCase()}.png`}
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
              <Text
                size="sm"
                span
                ml={4}
                ff="heading"
                c={`${color}.2`}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                ({color})
              </Text>

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
              <Neighbors neighbors={props.playerData.neighbors || []} />
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
            {CardbackStack}
          </Grid.Col>
          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            {LeaderStack}
          </Grid.Col>
          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            {ScoredSecretStack}
          </Grid.Col>
          <Grid.Col
            span={{
              base: 6,
              sm: 3,
            }}
            hiddenFrom="lg"
          >
            {PromissoryNoteStack}
          </Grid.Col>

          <Grid.Col span={12} hiddenFrom="sm">
            {RelicStack}
          </Grid.Col>

          <Grid.Col span={2} visibleFrom="lg">
            <Stack h="100%">
              {CardbackStack}

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
                        {tactics}/{fleet}/{strategy}
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

              {ScoredSecretStack}
              {PromissoryNoteStack}
              {/* Needs to Follow Section */}
              <NeedsToFollow
                values={[
                  needsToFollow.blue,
                  needsToFollow.green,
                  needsToFollow.violet,
                ]}
              />
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
                {LeaderStack}
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
              >
                <ArmyStats stats={armyStats} />
              </Grid.Col>
              <Grid.Col
                span={{
                  base: 12,
                  sm: 2,
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
                    <Group gap="md">
                      {/* Total Section */}
                      <Stack gap="xs">
                        <Caption>Total</Caption>
                        <ResourceInfluenceDisplay
                          resources={planetEconomics.total.currentResources}
                          totalResources={planetEconomics.total.totalResources}
                          influence={planetEconomics.total.currentInfluence}
                          totalInfluence={planetEconomics.total.totalInfluence}
                        />
                      </Stack>

                      {/* Optimal Section */}
                      <Stack gap="xs">
                        <Caption>Optimal</Caption>
                        <ResourceInfluenceDisplay
                          resources={planetEconomics.optimal.currentResources}
                          totalResources={
                            planetEconomics.optimal.totalResources
                          }
                          influence={planetEconomics.optimal.currentInfluence}
                          totalInfluence={
                            planetEconomics.optimal.totalInfluence
                          }
                        />
                      </Stack>
                    </Group>

                    {/* Debt Section */}
                    {/* <DebtTokens debts={debts} /> */}
                  </Stack>
                </Surface>
              </Grid.Col>
              <Grid.Col
                span={{
                  base: 12,
                  sm: 7,
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
                          techSkipIcons={techSkipIcons}
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
          src={`/factions/${faction.toLowerCase()}.png`}
          alt="faction"
          w="100%"
          h="100%"
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Paper>
  );
}
