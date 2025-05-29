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
import { techs as techsData } from "../data/tech";
import { planets } from "../data/planets";
import { secretObjectives } from "../data/secretObjectives";
import { PlayerData } from "@/data/pbd10242";

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
  strategyCardName: "LEADERSHIP",
  strategyCardNumber: 1,
  tactics: 1,
  fleet: 4,
  strategy: 2,
  fragments: ["crf1", "crf2", "crf3", "hrf1", "hrf2", "irf1"],
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
  techs: ["amd", "gd", "fl", "lwd", "st", "ps", "dxa", "hm", "ie"],
  relics: ["shard", "emphidia", "obsidian", "stellarconverter"],
  promissoryNotes: ["convoys", "war_funding", "terraform"],
  planets: [
    "mr",
    "abyz",
    "fria",
    "bereg",
    "lirtaiv",
    "meer",
    "arinam",
    "arnor",
    "lor",
    "winnu",
  ],
  neighborFactions: [
    { factionIcon: "/factions/hacan.png" },
    { factionIcon: "/factions/letnev.png" },
    { factionIcon: "/factions/titans.png" },
  ],
  secretsScored: {
    gamf: 685,
    mp: 583,
    uf: 189,
  },
  unitsOwned: [
    "sol_carrier",
    "flagship",
    "spacedock",
    "destroyer",
    "fighter",
    "dreadnought",
    "sol_infantry",
    "cruiser",
    "pds",
    "mech",
  ],
  leaders: [
    {
      id: "solagent",
      type: "agent",
      tgCount: 0,
      exhausted: false,
      locked: false,
      active: true,
    },
    {
      id: "solcommander",
      type: "commander",
      tgCount: 0,
      exhausted: false,
      locked: true,
      active: false,
    },
    {
      id: "solhero",
      type: "hero",
      tgCount: 0,
      exhausted: false,
      locked: false,
      active: true,
    },
  ],
  cardbacks: [
    {
      src: "/cardback/cardback_so.png",
      alt: "secret objectives",
      count: 0,
    },
    {
      src: "/cardback/cardback_action.png",
      alt: "action cards",
      count: 4,
    },
    {
      src: "/cardback/cardback_pn.png",
      alt: "promissory notes",
      count: 7,
    },
    {
      src: "/cardback/cardback_tg.png",
      alt: "trade goods",
      count: 17,
    },
    {
      src: "/cardback/cardback_comms.png",
      alt: "commodities",
      count: "0/6",
    },
  ],
};

type Props = {
  playerData: PlayerData;
};
export default function PlayerCard2(props: Props) {
  const {
    userName,
    faction,
    color,
    strategyCardName,
    strategyCardNumber,
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
    cardbacks,
  } = { ...DEFAULT_PLAYER_CARD_DATA, ...props.playerData };

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
      {cardbacks.map((cardback, index) => (
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
      <Shimmer
        color="red"
        p={2}
        px="sm"
        pl="lg"
        pos="relative"
        display="flex"
        style={{
          minWidth: "140px",
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(239, 68, 68, 0.08) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "8px",
        }}
      >
        {/* Additional subtle inner glow overlay */}
        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Box
          bg="white"
          pos="absolute"
          top={0}
          left={-10}
          w={35}
          h={35}
          display="flex"
          style={{
            border: "3px solid var(--mantine-color-red-7)",
            borderRadius: "999px",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
            zIndex: 2,
          }}
        >
          <Text ff="heading" c="red.9" size="30px">
            {strategyCardNumber}
          </Text>
        </Box>
        <Text
          ff="heading"
          c="white"
          size="xl"
          pos="relative"
          px={24}
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        >
          {strategyCardName}
        </Text>
      </Shimmer>

      {/* Speaker Token */}
      <SpeakerToken isVisible={hasSpeaker} />
    </Group>
  );

  // Gradient dictionary for header bottom border accents
  const HEADER_GRADIENTS = {
    pink: "linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.5) 20%, rgba(236, 72, 153, 0.5) 80%, transparent 100%)",
    yellow:
      "linear-gradient(90deg, transparent 0%, rgba(234, 179, 8, 0.5) 20%, rgba(234, 179, 8, 0.5) 80%, transparent 100%)",
    green:
      "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.5) 20%, rgba(34, 197, 94, 0.5) 80%, transparent 100%)",
    purple:
      "linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.5) 20%, rgba(147, 51, 234, 0.5) 80%, transparent 100%)",
    gray: "linear-gradient(90deg, transparent 0%, rgba(107, 114, 128, 0.5) 20%, rgba(107, 114, 128, 0.5) 80%, transparent 100%)",
    orange:
      "linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.5) 20%, rgba(249, 115, 22, 0.5) 80%, transparent 100%)",
    red: "linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.5) 20%, rgba(239, 68, 68, 0.5) 80%, transparent 100%)",
  };

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
          "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        overflow: "hidden",
        "@keyframes shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      }}
      radius="md"
      shadow="xl"
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
            "radial-gradient(ellipse at center, rgba(148, 163, 184, 0.02) 0%, transparent 70%)",
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
              background: (HEADER_GRADIENTS as any)[color],
            }}
          />

          <Group justify="space-between" align="center">
            <Group gap={4} px={4} align="center">
              <Text span c="white" size="lg" ff="heading">
                {userName}
              </Text>
              <Text size="md" span ml={4} opacity={0.9} c="white" ff="heading">
                [{faction}]
              </Text>
              <Text size="sm" span ml={4} ff="heading" c={`${color}.2`}>
                ({color})
              </Text>

              {/* Status Indicator - moved after color label */}
              <Box
                px={8}
                py={2}
                ml={4}
                style={{
                  borderRadius: "4px",
                  background: hasPassed
                    ? "linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(75, 85, 99, 0.15) 100%)"
                    : "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 100%)",
                  border: hasPassed
                    ? "1px solid rgba(107, 114, 128, 0.3)"
                    : "1px solid rgba(34, 197, 94, 0.3)",
                  boxShadow: hasPassed
                    ? "0 2px 4px rgba(107, 114, 128, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                    : "0 2px 4px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                }}
              >
                <Text
                  size="xs"
                  fw={700}
                  c={hasPassed ? "gray.4" : "green.3"}
                  style={{
                    textTransform: "uppercase",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                    letterSpacing: "0.5px",
                    fontSize: "10px",
                  }}
                >
                  {hasPassed ? "PASSED" : "ACTIVE"}
                </Text>
              </Box>

              {/* Header Neighbors Section - embossed duplicate */}
              <Box
                px={8}
                py={4}
                ml={8}
                pos="relative"
                style={{
                  borderRadius: "6px",
                  background:
                    "linear-gradient(145deg, rgba(10, 15, 30, 0.9) 0%, rgba(20, 25, 40, 0.7) 50%, rgba(15, 20, 35, 0.8) 100%)",
                  border: "1px solid rgba(0, 0, 0, 0.5)",
                  boxShadow:
                    "inset 2px 2px 6px rgba(0, 0, 0, 0.6), inset -1px -1px 3px rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                {/* Top-left dark shadow for depth */}
                <Box
                  pos="absolute"
                  top={0}
                  left={0}
                  w="60%"
                  h="60%"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
                    borderRadius: "6px 0 0 0",
                    pointerEvents: "none",
                  }}
                />

                {/* Bottom-right highlight */}
                <Box
                  pos="absolute"
                  bottom={0}
                  right={0}
                  w="50%"
                  h="50%"
                  style={{
                    background:
                      "linear-gradient(315deg, rgba(255, 255, 255, 0.06) 0%, transparent 60%)",
                    borderRadius: "0 0 6px 0",
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
                      textShadow: "0 1px 1px rgba(0, 0, 0, 0.8)",
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
                <Box>
                  <Text ff="mono" size="sm">
                    T/F/S
                  </Text>
                  <Text ff="mono" size="sm">
                    {tactics}/{fleet}/{strategy}
                  </Text>
                </Box>
                {fragmentCounts.cultural +
                  fragmentCounts.hazardous +
                  fragmentCounts.industrial >
                  0 && (
                  <>
                    <Box h={35}>
                      <ShimmerDivider orientation="vertical" />
                    </Box>
                    <Group gap="xs" justify="center" align="center">
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
                  </>
                )}
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

      <Box
        pos="absolute"
        bottom={-60}
        right={-40}
        opacity={0.05}
        h={300}
        style={{
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Image
          src="/sol.png"
          alt="faction"
          w="100%"
          h="100%"
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Paper>
  );
}
