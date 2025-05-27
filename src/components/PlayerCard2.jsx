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
import { Tech } from "./PlayerArea/Tech";
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

// Mock unit data - only two units have captured values
const UNIT_DATA = [
  { name: "dest", type: "dd", reinforcements: 3, captured: 0 },
  {
    name: "carrier",
    type: "ca",
    reinforcements: 2,
    captured: 1,
    isUpgraded: true,
  },
  {
    name: "cruiser",
    type: "cv",
    reinforcements: 4,
    captured: 0,
    isUpgraded: true,
    isFaction: true,
    factionIcon: "/sol.png",
  },
  { name: "flagship", type: "fs", reinforcements: 1, captured: 2 },
  { name: "war sun", type: "ws", reinforcements: 5, captured: 0 },
  { name: "fighter", type: "ff", reinforcements: 2, captured: 0 },
  {
    name: "infantry",
    type: "inf",
    reinforcements: 3,
    captured: 0,
    isUpgraded: false,
    isFaction: true,
    factionIcon: "/sol.png",
  },
  { name: "mech", type: "me", reinforcements: 1, captured: 0 },
  { name: "PDS", type: "pd", reinforcements: 4, captured: 0 },
  { name: "SD", type: "sd", reinforcements: 2, captured: 0 },
  { name: "dread", type: "dn", reinforcements: 3, captured: 0 },
  // { type: "cr", reinforcements: 1, captured: 0 },
];

// Map unit types to their correct image file names
const getUnitImageName = (unitType) => {
  const imageMap = {
    cr: "cv", // cruiser image is cv
    inf: "gf", // infantry image is gf
    me: "mf", // mech image is mf
  };
  return imageMap[unitType] || unitType;
};

export default function PlayerCard2({
  playerName = "Alice",
  faction = "Federation of Sol",
  color = "blue",
  strategyCard = 4,
  actionCards = 7,
  secretObjectives = 2,
  publicObjectives = 1,
  tradeGoods = 3,
  commodities = 4,
  tactics = 1,
  fleet = 4,
  strategy = 2,
  hasPassed = false,
  hasSpeaker = true,
  armyStats = {
    spaceHealth: 8,
    groundHealth: 12,
    spaceHit: 4,
    groundHit: 6,
    spaceUnits: 2,
    groundUnits: 3,
  },
  debts = [
    { factionIcon: "/factions/hacan.png" },
    { factionIcon: "/factions/hacan.png" },
    { factionIcon: "/factions/hacan.png" },
  ],
  leaders = [
    "1. Evelyn Delouis",
    "2. Claire Gibson",
    "3. Jace X. 4th Air Legion",
  ],
  techs = [
    {
      name: "Anti-Mass Deflectors",
      color: "blue",
      isUnitUpgrade: false,
      tier: 0,
    },
    { name: "Gravity Drive", color: "blue", isUnitUpgrade: false, tier: 1 },
    { name: "Fleet Logistics", color: "blue", isUnitUpgrade: false, tier: 2 },
    {
      name: "Light-Wave Deflector",
      color: "blue",
      isUnitUpgrade: false,
      tier: 3,
    },

    { name: "Sarween Tools", color: "yellow", isUnitUpgrade: false, tier: 0 },
    { name: "Plasma Scoring", color: "red", isUnitUpgrade: false, tier: 0 },
    {
      name: "Daxcive Animators",
      color: "green",
      isUnitUpgrade: false,
      tier: 1,
    },
    { name: "Hyper Metabolism", color: "green", isUnitUpgrade: false, tier: 2 },
    {
      name: "Integrated Economy",
      color: "yellow",
      isUnitUpgrade: false,
      tier: 3,
    },

    // Faction techs
    // {
    //   name: "Advanced Carrier II",
    //   color: "grey",
    //   isUnitUpgrade: true,
    //   isFaction: true,
    //   factionIcon: "/sol.png",
    //   tier: 0,
    // },
    // {
    //   name: "Spec Ops II",
    //   color: "grey",
    //   isUnitUpgrade: true,
    //   isFaction: true,
    //   factionIcon: "/sol.png",
    //   tier: 0,
    // },

    // { name: "Carrier II", color: "blue", isUnitUpgrade: true },
    // { name: "Dreadnought II", color: "yellow", isUnitUpgrade: true },
    // { name: "Fighter II", color: "green", isUnitUpgrade: true },
  ],
  relics = [
    "Shard of the Throne",
    "Crown of Emphidia",
    "Obsidian",
    "Stellar Converter",
  ],
  promissoryNotes = ["Support for the Throne", "Trade Agreement"],
  planets = [
    { name: "Mecatol Rex", resources: 1, influence: 6 },
    {
      name: "Abyz",
      resources: 3,
      influence: 0,
      trait: "hazardous",
      techSkip: "warfare",
    },
    { name: "Fria", resources: 2, influence: 0, trait: "hazardous" },
    { name: "Bereg", resources: 3, influence: 1, trait: "hazardous" },
    { name: "Lirta IV", resources: 2, influence: 3, trait: "industrial" },
    {
      name: "Meer",
      resources: 0,
      influence: 4,
      trait: "cultural",
      techSkip: "biotic",
    },
    { name: "Arinam", resources: 1, influence: 2, trait: "industrial" },
    { name: "Arnor", resources: 2, influence: 1, trait: "industrial" },
    { name: "Lor", resources: 1, influence: 2, trait: "industrial" },
    { name: "Winnu", resources: 3, influence: 1, trait: "cultural" },
  ],
  neighbors = ["Player 2", "Player 3"],
  scoredSecrets = [
    "(685) Gather a Mighty Fleet",
    "(583) Monopolize Production",
    "(189) Unveil Flagship",
  ],
}) {
  const totalResources = planets.reduce(
    (sum, planet) => sum + planet.resources,
    0
  );
  const totalInfluence = planets.reduce(
    (sum, planet) => sum + planet.influence,
    0
  );

  const planetTraitIcons = {
    cultural: (
      <Image
        src={`/planet_attributes/pc_attribute_cultural.png`}
        alt="cultural"
        style={{ width: "24px", height: "24px" }}
      />
    ),
    hazardous: (
      <Image
        src={`/planet_attributes/pc_attribute_hazardous.png`}
        alt="hazardous"
        style={{ width: "24px", height: "24px" }}
      />
    ),
    industrial: (
      <Image
        src={`/planet_attributes/pc_attribute_industrial.png`}
        alt="industrial"
        style={{ width: "24px", height: "24px" }}
      />
    ),
  };

  const techSkipIcons = {
    biotic: (
      <Image
        src={`/green.png`}
        alt="biotic"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    propulsion: (
      <Image
        src={`/blue.png`}
        alt="propulsion"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    cybernetic: (
      <Image
        src={`/yellow.png`}
        alt="cybernetic"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    warfare: (
      <Image
        src={`/red.png`}
        alt="warfare"
        style={{ width: "16px", height: "16px" }}
      />
    ),
  };

  const LeaderStack = (
    <Stack gap={4} style={{ overflow: "hidden" }}>
      <Leader
        imageUrl="/commanders/solagent.webp"
        title="Evelyn Delouis"
        description="Agent"
        active={true}
      />
      <Leader
        imageUrl="/commanders/solcommander.webp"
        title="Claire Gibson"
        description="Commander"
        active={false}
      />
      <Leader
        imageUrl="/commanders/solhero.webp"
        title="Jace X."
        description="Hero"
        active={true}
      />
    </Stack>
  );

  const CardbackStack = (
    <Group gap={6} justify="center">
      <Cardback
        src="/cardback/cardback_so.png"
        alt="secret objectives"
        count={0}
      />
      <Cardback
        src="/cardback/cardback_action.png"
        alt="action cards"
        count={4}
      />
      <Cardback
        src="/cardback/cardback_pn.png"
        alt="promissory notes"
        count={7}
      />
      <Cardback src="/cardback/cardback_tg.png" alt="trade goods" count={17} />
      <Cardback
        src="/cardback/cardback_comms.png"
        alt="commodities"
        count="0/6"
      />
    </Group>
  );

  const PromissoryNoteStack = (
    <Stack gap={4}>
      <PromissoryNote
        name="Alliance"
        factionIcon="/factions/hacan.png"
        isOtherFaction={true}
      />
      <PromissoryNote
        name="Alliance"
        factionIcon="/factions/letnev.png"
        isOtherFaction={true}
      />
      <PromissoryNote
        name="Support for the Throne"
        factionIcon="/factions/titans.png"
        isOtherFaction={true}
      />
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
        {UNIT_DATA.map((unit, index) => (
          <UnitCard
            key={index}
            unit={unit}
            getUnitImageName={getUnitImageName}
            maxReinforcements={8}
          />
        ))}
      </SimpleGrid>
    </Surface>
  );

  const RelicStack = (
    <Stack gap={4} w={{ base: "100%", sm: "fit-content" }}>
      {relics.map((relic, index) => (
        <Relic key={index} name={relic} />
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
        align="center"
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
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Box
          bg="white"
          style={{
            border: "3px solid var(--mantine-color-red-7)",
            borderRadius: "999px",
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "0px",
            left: "-10px",
            filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
            zIndex: 2,
          }}
        >
          <Text ff="heading" c="red.9" size="30px">
            1
          </Text>
        </Box>
        <Text
          ff="heading"
          c="white"
          size="xl"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            position: "relative",
            padding: "0 24px",
            zIndex: 1,
          }}
        >
          LEADERSHIP
        </Text>
      </Shimmer>

      {/* Speaker Token */}
      <SpeakerToken isVisible={hasSpeaker} />
    </Group>
  );

  return (
    <Paper
      p="sm"
      style={{
        maxWidth: "100%",
        margin: "5px",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        position: "relative",
        overflow: "hidden",
        "@keyframes shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      }}
      radius="md"
      shadow="xl"
      pos="relative"
    >
      {/* Subtle inner glow */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, rgba(148, 163, 184, 0.02) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box style={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Box
          p="sm"
          mb="lg"
          style={{
            borderRadius: 0,
            borderBottomRightRadius: 8,
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(30, 41, 59, 0.95) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(148, 163, 184, 0.15)",
            marginTop: "-16px",
            marginLeft: "-16px",
            marginRight: "-8px",
          }}
        >
          {/* Header diagonal pattern overlay */}
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
                  rgba(148, 163, 184, 0.03) 0px,
                  rgba(148, 163, 184, 0.03) 1px,
                  transparent 1px,
                  transparent 20px
                )
              `,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />

          {/* Header bottom border accent */}
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              // background:
              //   "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.5) 20%, rgba(59, 130, 246, 0.5) 80%, transparent 100%)",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.5) 20%, rgba(236, 72, 153, 0.5) 80%, transparent 100%)",
            }}
          />

          <Group justify="space-between" align="center">
            <Group gap={4} px={4} align="center">
              <Text span c="white" size="lg" ff="heading">
                {playerName}
              </Text>
              <Text size="md" span ml={4} opacity={0.9} c="white" ff="heading">
                [{faction}]
              </Text>
              <Text size="sm" span ml={4} ff="heading" c="pink">
                (pink)
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
                style={{
                  borderRadius: "6px",
                  background:
                    "linear-gradient(145deg, rgba(10, 15, 30, 0.9) 0%, rgba(20, 25, 40, 0.7) 50%, rgba(15, 20, 35, 0.8) 100%)",
                  border: "1px solid rgba(0, 0, 0, 0.5)",
                  boxShadow:
                    "inset 2px 2px 6px rgba(0, 0, 0, 0.6), inset -1px -1px 3px rgba(255, 255, 255, 0.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top-left dark shadow for depth */}
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "60%",
                    height: "60%",
                    background:
                      "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
                    borderRadius: "6px 0 0 0",
                    pointerEvents: "none",
                  }}
                />

                {/* Bottom-right highlight */}
                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "50%",
                    height: "50%",
                    background:
                      "linear-gradient(315deg, rgba(255, 255, 255, 0.06) 0%, transparent 60%)",
                    borderRadius: "0 0 6px 0",
                    pointerEvents: "none",
                  }}
                />

                <Group
                  gap={2}
                  align="center"
                  style={{ position: "relative", zIndex: 1 }}
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
                  <Image
                    src="/factions/hacan.png"
                    style={{
                      width: "18px",
                      height: "18px",
                      filter:
                        "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
                    }}
                  />
                  <Image
                    src="/factions/letnev.png"
                    style={{
                      width: "18px",
                      height: "18px",
                      filter:
                        "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
                    }}
                  />
                  <Image
                    src="/factions/titans.png"
                    style={{
                      width: "18px",
                      height: "18px",
                      filter:
                        "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
                    }}
                  />
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
              {scoredSecrets.map((secret, index) => (
                <ScoredSecret key={index} text={secret} />
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
                <Group gap="xs" justify="center" align="center">
                  <FragmentStack count={3} type="crf" />
                  <FragmentStack count={2} type="hrf" />
                  <FragmentStack count={1} type="urf" />
                </Group>
                <Box h={35}>
                  <ShimmerDivider orientation="vertical" />
                </Box>
                <Box>
                  <Text ff="mono" size="sm">
                    T/F/S
                  </Text>
                  <Text ff="mono" size="sm">
                    3/2/1
                  </Text>
                </Box>
              </Group>

              <Stack gap={4}>
                {scoredSecrets.map((secret, index) => (
                  <ScoredSecret key={index} text={secret} />
                ))}
              </Stack>
              {PromissoryNoteStack}
              {/* Needs to Follow Section */}
              <Group gap={8} align="center">
                <Box alignSelf="center">
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
                    2
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c="green.3"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    4
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c="violet.3"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    8
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
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      height: "100%",
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
                            {techs
                              .filter((v) => v.color === "blue")
                              .map((tech, index) => (
                                <Tech key={index} tech={tech} />
                              ))}
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
                            {techs
                              .filter((v) => v.color === "yellow")
                              .map((tech, index) => (
                                <Tech key={index} tech={tech} />
                              ))}
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
                            {techs
                              .filter((v) => v.color === "green")
                              .map((tech, index) => (
                                <Tech key={index} tech={tech} />
                              ))}
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
                            {techs
                              .filter((v) => v.color === "red")
                              .map((tech, index) => (
                                <Tech key={index} tech={tech} />
                              ))}
                          </Stack>
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
                    style={{ position: "relative", zIndex: 1 }}
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
                    style={{
                      flex: 1,
                      alignItems: "flex-start",
                      height: "100%",
                    }}
                  >
                    <Group gap="xs" style={{ position: "relative", zIndex: 1 }}>
                      {planets.map((planet, index) => (
                        <PlanetCard
                          key={index}
                          planet={planet}
                          planetTraitIcons={planetTraitIcons}
                          techSkipIcons={techSkipIcons}
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
                  {relics.map((relic, index) => (
                    <Relic key={index} name={relic} />
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Box>

      <Box
        style={{
          position: "absolute",
          bottom: -60,
          right: -40,
          opacity: 0.05,
          zIndex: 0,
          pointerEvents: "none",
          // width: "240px",
          height: "300px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/sol.png"
          alt="faction"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>
    </Paper>
  );
}
