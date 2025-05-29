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
import { ShimmerDivider } from "./PlayerArea/ShimmerDivider";
import { Caption } from "./PlayerArea/Caption";
import { ResourceInfluenceDisplay } from "./PlayerArea/ResourceInfluenceDisplay";
import { Relic } from "./PlayerArea/Relic";
import { Tech, PhantomTech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { Shimmer } from "./PlayerArea/Shimmer";
import { Cardback } from "./PlayerArea/Cardback";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { Leader } from "./PlayerArea/Leader";
import { PromissoryNote } from "./PlayerArea/PromissoryNote";
import { ScoredSecret } from "./PlayerArea/ScoredSecret";
import { FragmentStack } from "./PlayerArea/FragmentStack";
import { UnitCard } from "./PlayerArea/UnitCard";
import { ArmyStats } from "./PlayerArea/ArmyStats";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { SpeakerToken } from "./PlayerArea/SpeakerToken";
import { StrategyCardBanner } from "./PlayerArea/StrategyCardBanner";
import { getGradientConfig, ColorKey } from "./PlayerArea/gradients";
import { techs as techsData } from "../data/tech";
import { planets } from "../data/planets";
import { secretObjectives } from "../data/secretObjectives";
import { PlayerData } from "@/data/pbd10242";

// Helper function to get header gradient from color
const getHeaderGradient = (color: string): string => {
  const gradientConfig = getGradientConfig(color as ColorKey);
  return gradientConfig.shimmer;
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
  debts: {
    hacan: 3,
    letnev: 1,
  },
  neighborFactions: [
    { factionIcon: "/factions/hacan.png" },
    { factionIcon: "/factions/letnev.png" },
    { factionIcon: "/factions/titans.png" },
  ],
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
    hasPassed,
    hasSpeaker,
    armyStats,
    debts,
    techs,
    relics,
    planets,
    neighborFactions,
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

  const totalResources = planets.reduce((sum, planetId) => {
    const planetData = getPlanetData(planetId);
    return sum + (planetData ? planetData.resources : 0);
  }, 0);

  const totalInfluence = planets.reduce((sum, planetId) => {
    const planetData = getPlanetData(planetId);
    return sum + (planetData ? planetData.influence : 0);
  }, 0);

  const planetTraitIcons = {
    cultural: (
      <Image
        src={`/planet_attributes/pc_attribute_cultural.png`}
        alt="cultural"
        w={24}
        h={24}
      />
    ),
    hazardous: (
      <Image
        src={`/planet_attributes/pc_attribute_hazardous.png`}
        alt="hazardous"
        w={24}
        h={24}
      />
    ),
    industrial: (
      <Image
        src={`/planet_attributes/pc_attribute_industrial.png`}
        alt="industrial"
        w={24}
        h={24}
      />
    ),
  };

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
      {promissoryNotes.map((noteId, index) => (
        <PromissoryNote key={index} promissoryNoteId={noteId} />
      ))}
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
      (_, index) => <PhantomTech key={`phantom-${index}`} techType={techType} />
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
          }}
        >
          {/* Header bottom border accent */}
          <Box
            pos="absolute"
            bottom={0}
            left={0}
            right={0}
            h={8}
            style={{
              background: getHeaderGradient(color),
            }}
          />

          <Group justify="space-between" align="center">
            <Group gap={4} px={4} align="center">
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
              <Box
                px={8}
                py={2}
                ml={4}
                style={{
                  borderRadius: "6px",
                  background: hasPassed
                    ? "linear-gradient(135deg, rgba(107, 114, 128, 0.12) 0%, rgba(75, 85, 99, 0.06) 100%)"
                    : "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.06) 100%)",
                  border: hasPassed
                    ? "1px solid rgba(107, 114, 128, 0.25)"
                    : "1px solid rgba(34, 197, 94, 0.25)",
                  boxShadow: hasPassed
                    ? "0 2px 8px rgba(107, 114, 128, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                    : "0 2px 8px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                }}
              >
                <Text
                  size="xs"
                  fw={700}
                  c={hasPassed ? "gray.4" : "green.3"}
                  style={{
                    textTransform: "uppercase",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    letterSpacing: "0.5px",
                    fontSize: "10px",
                  }}
                >
                  {hasPassed ? "PASSED" : "ACTIVE"}
                </Text>
              </Box>

              {/* Header Neighbors Section - harmonized with Surface component styling */}
              <Box
                px={8}
                py={4}
                ml={8}
                pos="relative"
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  boxShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                  overflow: "hidden",
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

                <Group
                  gap={6}
                  align="center"
                  pos="relative"
                  style={{ zIndex: 1 }}
                >
                  <Text
                    size="xs"
                    fw={600}
                    c="gray.4"
                    style={{
                      textTransform: "uppercase",
                      fontSize: "9px",
                      letterSpacing: "0.5px",
                      marginRight: "4px",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    Neighbors:
                  </Text>
                  {neighborFactions.map((neighbor, index) => (
                    <Image
                      key={index}
                      src={neighbor.factionIcon}
                      w={18}
                      h={18}
                      style={{
                        filter:
                          "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
                      }}
                    />
                  ))}
                </Group>
              </Box>
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
            <Stack gap={2}>
              {Object.entries(secretsScored).map(([secretId, score]) => (
                <ScoredSecret
                  key={secretId}
                  secretId={secretId}
                  score={score}
                />
              ))}
            </Stack>
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
            <Stack>
              {CardbackStack}
              <Group gap="xs" justify="space-around" align="center">
                <Box p="md" h="fit-content" w="100%">
                  <Group gap={0} align="flex-end" justify="space-between">
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
                      <Box
                        p="sm"
                        style={{
                          borderRadius: "8px 0 0 8px",
                          background:
                            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRight: "none",
                          minWidth: "80px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow:
                            "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
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
                          pos="relative"
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
                      </Box>
                    </Stack>
                    {/* Fragments Section - harmonized with Surface component styling */}
                    <Stack gap={4} align="center" flex={1}>
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
                      <Box
                        p="sm"
                        w="100%"
                        style={{
                          borderRadius: "0 8px 8px 0",
                          background:
                            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderLeft: "1px solid rgba(148, 163, 184, 0.1)",
                          height: "60px",
                          boxShadow:
                            "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                        }}
                      >
                        <Group
                          gap="xs"
                          justify="center"
                          align="center"
                          pos="relative"
                          style={{ zIndex: 1 }}
                        >
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
                        </Group>
                      </Box>
                    </Stack>
                  </Group>
                </Box>
              </Group>

              <Stack gap={4}>
                {Object.entries(secretsScored).map(([secretId, score]) => (
                  <ScoredSecret
                    key={secretId}
                    secretId={secretId}
                    score={score}
                  />
                ))}
              </Stack>
              {PromissoryNoteStack}
              {/* Needs to Follow Section */}
              <Group gap={8} align="center">
                <Box style={{ alignSelf: "center" }}>
                  <Caption>Needs to Follow</Caption>
                </Box>
                <Group gap={6}>
                  <Text
                    size="lg"
                    fw={700}
                    c="blue.3"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {needsToFollow.blue}
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c="green.3"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {needsToFollow.green}
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c="violet.3"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {needsToFollow.violet}
                  </Text>
                </Group>
              </Group>
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
                <Surface p="md" pattern="none" h="100%">
                  <Stack
                    justify="space-between"
                    h="100%"
                    pos="relative"
                    style={{ zIndex: 1 }}
                  >
                    {/* Total/Optimal Section */}
                    <Group gap="md" align="start">
                      {/* Total Section */}
                      <Stack gap="xs">
                        <Caption>Total</Caption>
                        <ResourceInfluenceDisplay
                          resources={totalResources - 3}
                          totalResources={totalResources}
                          influence={totalInfluence - 1}
                          totalInfluence={totalInfluence}
                        />
                      </Stack>

                      {/* Optimal Section */}
                      <Stack gap="xs">
                        <Caption>Optimal</Caption>
                        <ResourceInfluenceDisplay
                          resources={totalResources - 3}
                          totalResources={totalResources}
                          influence={totalInfluence - 1}
                          totalInfluence={totalInfluence}
                        />
                      </Stack>
                    </Group>

                    {/* Debt Section */}
                    <DebtTokens debts={debts} />
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
                          planetTraitIcons={planetTraitIcons}
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
