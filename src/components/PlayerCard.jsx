import { useState } from "react";
import {
  Paper,
  Group,
  Badge,
  Tooltip,
  Text,
  Grid,
  Stack,
  ActionIcon,
  Box,
  useMantineTheme,
  Image,
  Chip,
  Divider,
} from "@mantine/core";
import {
  IconAnchor,
  IconBuilding,
  IconUsers,
  IconLeaf,
  IconMountain,
  IconFlag,
} from "@tabler/icons-react";
import StrategyCard from "./StrategyCard";

export default function PlayerCard({
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
  leaders = [
    "1. Evelyn Delouis",
    "2. Claire Gibson",
    "3. Jace X. 4th Air Legion",
  ],
  techs = [
    { name: "Anti-Mass Deflectors", color: "blue", isUnitUpgrade: false },
    { name: "Gravity Drive", color: "blue", isUnitUpgrade: false },
    { name: "Fleet Logistics", color: "blue", isUnitUpgrade: false },
    { name: "Light-Wave Deflector", color: "blue", isUnitUpgrade: false },

    { name: "Sarween Tools", color: "yellow", isUnitUpgrade: false },
    { name: "Plasma Scoring", color: "red", isUnitUpgrade: false },
    { name: "Daxcive Animators", color: "green", isUnitUpgrade: false },
    { name: "Hyper Metabolism", color: "green", isUnitUpgrade: false },
    { name: "Integrated Economy", color: "yellow", isUnitUpgrade: false },

    // { name: "Carrier II", color: "blue", isUnitUpgrade: true },
    // { name: "Dreadnought II", color: "yellow", isUnitUpgrade: true },
    // { name: "Fighter II", color: "green", isUnitUpgrade: true },
  ],
  relics = [
    "Shard of the Throne",
    "Crown of Emphidia",
    // "Obsidian",
    // "Stellar Converter",
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

  const traitIcons = {
    cultural: <IconLeaf size={12} color="green" />,
    hazardous: <IconMountain size={12} color="red" />,
    industrial: <IconBuilding size={12} color="yellow" />,
  };

  const planetTraitIcons = {
    cultural: (
      <Image
        src={`/planet_attributes/pc_attribute_cultural.png`}
        alt="cultural"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    hazardous: (
      <Image
        src={`/planet_attributes/pc_attribute_hazardous.png`}
        alt="hazardous"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    industrial: (
      <Image
        src={`/planet_attributes/pc_attribute_industrial.png`}
        alt="industrial"
        style={{ width: "16px", height: "16px" }}
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
      }}
      radius="md"
      shadow="xl"
      pos="relative"
    >
      {/* Very subtle background grid */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

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

      {/* Content wrapper with higher z-index */}
      <Box style={{ position: "relative", zIndex: 1 }}>
        <Group justify="space-between" mb="lg">
          <Group gap={30}>
            <Group gap={4} py={2}>
              <Text span c="white" size="lg" ff="heading">
                {playerName}
              </Text>
              <Text size="md" span ml={4} opacity={0.9} c="white" ff="heading">
                [{faction}]
              </Text>
              <Text size="sm" span ml={4} ff="heading" c="pink">
                (pink)
              </Text>
            </Group>
          </Group>

          <Box
            p={2}
            px="sm"
            pl="lg"
            style={{
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
              boxShadow:
                "0 4px 12px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              position: "relative",
            }}
            pos="relative"
            align="center"
            display="flex"
          >
            {/* Top shimmer */}
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)",
              }}
            />
            {/* Bottom shimmer */}
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)",
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
                padding: "0 20px",
              }}
            >
              LEADERSHIP
            </Text>
          </Box>
        </Group>

        <Grid gutter="md" columns={12}>
          <Grid.Col span={2}>
            <Stack>
              <Group gap={6}>
                <Box pos="relative">
                  <Box
                    style={{
                      width: "45px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                  >
                    <Image
                      src="/cardback/cardback_so.png"
                      alt="secret objectives"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      left: 10,
                      bottom: 1,
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
                      borderRadius: "4px",
                      boxShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                    px={6}
                    py={1}
                  >
                    <Text
                      size="lg"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      0
                    </Text>
                  </Box>
                </Box>

                <Box pos="relative">
                  <Box
                    style={{
                      width: "45px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                  >
                    <Image
                      src="/cardback/cardback_action.png"
                      alt="action cards"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      left: 10,
                      bottom: 1,
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
                      borderRadius: "4px",
                      boxShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                    px={6}
                    py={1}
                  >
                    <Text
                      size="lg"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      4
                    </Text>
                  </Box>
                </Box>

                <Box pos="relative">
                  <Box
                    style={{
                      width: "45px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                  >
                    <Image
                      src="/cardback/cardback_pn.png"
                      alt="promissory notes"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      left: 10,
                      bottom: 1,
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
                      borderRadius: "4px",
                      boxShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                    px={6}
                    py={1}
                  >
                    <Text
                      size="lg"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      7
                    </Text>
                  </Box>
                </Box>

                <Box pos="relative">
                  <Box
                    style={{
                      width: "45px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                  >
                    <Image
                      src="/cardback/cardback_tg.png"
                      alt="trade goods"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      left: 6,
                      bottom: 1,
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
                      borderRadius: "4px",
                      boxShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                    px={6}
                    py={1}
                  >
                    <Text
                      size="lg"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      17
                    </Text>
                  </Box>
                </Box>

                <Box pos="relative">
                  <Box
                    style={{
                      width: "45px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                  >
                    <Image
                      src="/cardback/cardback_comms.png"
                      alt="commodities"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      left: 2,
                      bottom: 1,
                      background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
                      borderRadius: "4px",
                      boxShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                    }}
                    px={6}
                    py={1}
                  >
                    <Text
                      size="lg"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      0/6
                    </Text>
                  </Box>
                </Box>
              </Group>
              <Stack gap={2}>
                {scoredSecrets.map((secret, index) => (
                  <Box
                    key={index}
                    p={2}
                    px="sm"
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)",
                      boxShadow:
                        "0 2px 8px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top shimmer */}
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.6) 50%, transparent 100%)",
                      }}
                    />
                    {/* Bottom shimmer */}
                    <Box
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.6) 50%, transparent 100%)",
                      }}
                    />
                    <Box
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Image
                        src="/so_icon.png"
                        style={{
                          width: "20px",
                          height: "20px",
                          filter:
                            "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
                        }}
                      />
                      <Text
                        size="xs"
                        fw={700}
                        c="white"
                        style={{
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.7)",
                          lineHeight: 1.2,
                        }}
                      >
                        {secret}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={7}>
            <Stack gap="md">
              <Group
                p="md"
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                }}
              >
                <Text
                  size="xs"
                  fw={700}
                  c="blueGray.3"
                  style={{
                    textTransform: "uppercase",
                    bottom: 15,
                    position: "absolute",
                    right: 20,
                  }}
                >
                  TECH
                </Text>
                {/* Animated corner accents */}
                <Box
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderRight: "none",
                    borderBottom: "none",
                    borderRadius: "4px 0 0 0",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderRadius: "0 4px 0 0",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderRight: "none",
                    borderTop: "none",
                    borderRadius: "0 0 0 4px",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderLeft: "none",
                    borderTop: "none",
                    borderRadius: "0 0 4px 0",
                  }}
                />

                {/* Subtle grid pattern overlay */}
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                      linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                    pointerEvents: "none",
                  }}
                />

                <Group
                  gap="xs"
                  align="top"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <Stack gap="xs">
                    {techs
                      .filter((v) => v.color === "blue")
                      .map((tech, index) => (
                        <Box
                          key={index}
                          py={2}
                          px="xs"
                          style={{
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "2px",
                              background:
                                "linear-gradient(180deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.2) 100%)",
                            }}
                          />
                          <Group gap={4} style={{ position: "relative" }}>
                            <Image
                              src={`/${tech.color}.png`}
                              alt={tech.name}
                              style={{
                                width: "14px",
                                height: "14px",
                                filter:
                                  "drop-shadow(0 0 3px rgba(59, 130, 246, 0.3))",
                              }}
                            />
                            <Text
                              size="xs"
                              c="white"
                              fw={600}
                              style={{
                                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                              }}
                            >
                              {tech.name}
                            </Text>
                          </Group>
                        </Box>
                      ))}
                  </Stack>

                  <Stack gap="xs">
                    {techs
                      .filter((v) => v.color === "yellow")
                      .map((tech, index) => (
                        <Tooltip key={index} label={tech.name}>
                          <Box
                            py={2}
                            px="xs"
                            style={{
                              borderRadius: "4px",
                              background:
                                "linear-gradient(90deg, rgba(234, 179, 8, 0.1) 0%, rgba(234, 179, 8, 0.05) 100%)",
                              border: "1px solid rgba(234, 179, 8, 0.2)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "2px",
                                background:
                                  "linear-gradient(180deg, rgba(234, 179, 8, 0.6) 0%, rgba(234, 179, 8, 0.2) 100%)",
                              }}
                            />
                            <Group gap={4} style={{ position: "relative" }}>
                              <Image
                                src={`/${tech.color}.png`}
                                alt={tech.name}
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  filter:
                                    "drop-shadow(0 0 3px rgba(234, 179, 8, 0.3))",
                                }}
                              />
                              <Text
                                size="xs"
                                c="white"
                                fw={600}
                                style={{
                                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {tech.name}
                              </Text>
                            </Group>
                          </Box>
                        </Tooltip>
                      ))}
                  </Stack>

                  <Stack gap="xs">
                    {techs
                      .filter((v) => v.color === "green")
                      .map((tech, index) => (
                        <Tooltip key={index} label={tech.name}>
                          <Box
                            py={2}
                            px="xs"
                            style={{
                              borderRadius: "4px",
                              background:
                                "linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "2px",
                                background:
                                  "linear-gradient(180deg, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 100%)",
                              }}
                            />
                            <Group gap={4} style={{ position: "relative" }}>
                              <Image
                                src={`/${tech.color}.png`}
                                alt={tech.name}
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  filter:
                                    "drop-shadow(0 0 3px rgba(34, 197, 94, 0.3))",
                                }}
                              />
                              <Text
                                size="xs"
                                c="white"
                                fw={600}
                                style={{
                                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {tech.name}
                              </Text>
                            </Group>
                          </Box>
                        </Tooltip>
                      ))}
                  </Stack>

                  <Stack gap="xs">
                    {techs
                      .filter((v) => v.color === "red")
                      .map((tech, index) => (
                        <Tooltip key={index} label={tech.name}>
                          <Box
                            py={2}
                            px="xs"
                            style={{
                              borderRadius: "4px",
                              background:
                                "linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "2px",
                                background:
                                  "linear-gradient(180deg, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.2) 100%)",
                              }}
                            />
                            <Group gap={4} style={{ position: "relative" }}>
                              <Image
                                src={`/${tech.color}.png`}
                                alt={tech.name}
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  filter:
                                    "drop-shadow(0 0 3px rgba(239, 68, 68, 0.3))",
                                }}
                              />
                              <Text
                                size="xs"
                                c="white"
                                fw={600}
                                style={{
                                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {tech.name}
                              </Text>
                            </Group>
                          </Box>
                        </Tooltip>
                      ))}
                  </Stack>
                </Group>
                <Box style={{ position: "relative", zIndex: 1 }}>
                  <Image
                    src="/mockunitupgrades.png"
                    alt="unit upgrades"
                    style={{
                      width: "auto",
                      height: "110px",
                      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                </Box>
              </Group>

              <Box
                p="md"
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
                }}
              >
                <Text
                  size="xs"
                  fw={700}
                  c="blueGray.3"
                  style={{
                    textTransform: "uppercase",
                    bottom: 15,
                    position: "absolute",
                    right: 20,
                  }}
                >
                  Planets
                </Text>

                {/* Animated corner accents */}
                <Box
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderRight: "none",
                    borderBottom: "none",
                    borderRadius: "4px 0 0 0",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderRadius: "0 4px 0 0",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderRight: "none",
                    borderTop: "none",
                    borderRadius: "0 0 0 4px",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(59, 130, 246, 0.1)",
                    borderLeft: "none",
                    borderTop: "none",
                    borderRadius: "0 0 4px 0",
                  }}
                />

                <Group gap="xs" style={{ position: "relative", zIndex: 1 }}>
                  {planets.map((planet, index) => (
                    <Stack
                      key={index}
                      py={4}
                      px="xs"
                      justify="space-between"
                      h={140}
                      style={{
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${
                          planet.trait === "cultural"
                            ? "rgba(59, 130, 246, 0.12)"
                            : planet.trait === "hazardous"
                              ? "rgba(239, 68, 68, 0.12)"
                              : "rgba(34, 197, 94, 0.12)"
                        } 0%, rgba(15, 23, 42, 0.6) 100%)`,
                        border: `1px solid ${
                          planet.trait === "cultural"
                            ? "rgba(59, 130, 246, 0.3)"
                            : planet.trait === "hazardous"
                              ? "rgba(239, 68, 68, 0.3)"
                              : "rgba(34, 197, 94, 0.3)"
                        }`,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: `0 2px 8px ${
                          planet.trait === "cultural"
                            ? "rgba(59, 130, 246, 0.08)"
                            : planet.trait === "hazardous"
                              ? "rgba(239, 68, 68, 0.08)"
                              : "rgba(34, 197, 94, 0.08)"
                        }, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                      }}
                    >
                      {/* Subtle top highlight */}
                      <Box
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "20%",
                          right: "20%",
                          height: "1px",
                          background: `linear-gradient(90deg, transparent 0%, ${
                            planet.trait === "cultural"
                              ? "rgba(59, 130, 246, 0.4)"
                              : planet.trait === "hazardous"
                                ? "rgba(239, 68, 68, 0.4)"
                                : "rgba(34, 197, 94, 0.4)"
                          } 50%, transparent 100%)`,
                        }}
                      />

                      <Stack
                        gap={6}
                        style={{ position: "relative", zIndex: 1 }}
                      >
                        {planetTraitIcons[planet.trait]}
                        <Text
                          size="xs"
                          c="white"
                          fw={700}
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "sideways",
                            whiteSpace: "nowrap",
                            transform: "rotate(180deg)",
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                          }}
                        >
                          {planet.name}
                        </Text>
                      </Stack>
                      <Stack
                        gap={4}
                        style={{ position: "relative", zIndex: 1 }}
                      >
                        {planet.techSkip && techSkipIcons[planet.techSkip]}
                        <Stack gap={2}>
                          <Text
                            size="xs"
                            bg="blue"
                            px={4}
                            c="white"
                            fw={700}
                            style={{
                              borderRadius: "4px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                            }}
                          >
                            {planet.resources}
                          </Text>

                          <Text
                            size="xs"
                            bg="yellow"
                            px={4}
                            c="white"
                            fw={700}
                            style={{
                              borderRadius: "4px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                            }}
                          >
                            {planet.influence}
                          </Text>
                        </Stack>
                      </Stack>
                    </Stack>
                  ))}
                </Group>
              </Box>
            </Stack>
          </Grid.Col>
          <Grid.Col span={3}>
            <Stack>
              <Group>
                <Group
                  p={2}
                  px="sm"
                  style={{
                    borderRadius: "8px",
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                    boxShadow:
                      "0 4px 12px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: "150px",
                  }}
                  w="fit-content"
                >
                  {/* Top shimmer */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)",
                    }}
                  />
                  {/* Bottom shimmer */}
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)",
                    }}
                  />
                  <Box
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Image
                      src="/commanders/solagent.webp"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    <Stack gap={0}>
                      <Text
                        size="sm"
                        fw={700}
                        c="white"
                        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                      >
                        Evelyn Delouis
                      </Text>
                      <Text
                        size="xs"
                        c="green.3"
                        fw={500}
                        style={{ opacity: 0.8 }}
                      >
                        Agent
                      </Text>
                    </Stack>
                  </Box>
                </Group>

                <Group
                  p={2}
                  px="sm"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #6b7280",
                    background:
                      "linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)",
                    position: "relative",
                    overflow: "hidden",
                    opacity: 0.7,
                    minWidth: "100px",
                  }}
                  w="fit-content"
                >
                  <Box
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Image
                      src="/commanders/solcommander.webp"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                        filter: "grayscale(50%)",
                      }}
                    />
                    <Stack gap={0}>
                      <Text
                        size="sm"
                        fw={700}
                        c="gray.4"
                        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                      >
                        Claire Gibson
                      </Text>
                      <Text
                        size="xs"
                        c="gray.5"
                        fw={500}
                        style={{ opacity: 0.8 }}
                      >
                        Commander
                      </Text>
                    </Stack>
                  </Box>
                </Group>

                <Group
                  p={2}
                  px="sm"
                  style={{
                    borderRadius: "8px",
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                    boxShadow:
                      "0 4px 12px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: "150px",
                  }}
                  w="fit-content"
                >
                  {/* Top shimmer */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)",
                    }}
                  />
                  {/* Bottom shimmer */}
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)",
                    }}
                  />
                  <Box
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Image
                      src="/commanders/solhero.webp"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    <Stack gap={0}>
                      <Text
                        size="sm"
                        fw={700}
                        c="white"
                        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                      >
                        Jace X.
                      </Text>
                      <Text
                        size="xs"
                        c="green.3"
                        fw={500}
                        style={{ opacity: 0.8 }}
                      >
                        Hero
                      </Text>
                    </Stack>
                  </Box>
                </Group>
              </Group>

              <Group gap="xs">
                {relics.map((relic, index) => (
                  <Box
                    key={index}
                    p="sm"
                    px="md"
                    style={{
                      borderRadius: "6px",
                      background:
                        "linear-gradient(135deg, rgba(194, 65, 12, 0.15) 0%, rgba(234, 88, 12, 0.12) 50%, rgba(194, 65, 12, 0.15) 100%)",
                      border: "1px solid rgba(251, 191, 36, 0.4)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Very subtle background grid */}
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                          linear-gradient(rgba(251, 191, 36, 0.08) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(251, 191, 36, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: "20px 20px",
                        pointerEvents: "none",
                        opacity: 0.5,
                      }}
                    />

                    {/* Subtle inner glow */}
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />

                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        height: "100%",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src="/relicicon.webp"
                        style={{
                          width: "20px",
                          height: "20px",
                          filter:
                            "drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3))",
                        }}
                      />
                      <Text
                        size="sm"
                        fw={700}
                        c="white"
                        style={{
                          fontFamily: "SLIDER, monospace",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        {relic}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Group gap={2} mb="xs" mt="lg">
          {leaders.map((leader, index) => (
            <Box
              p={2}
              px="sm"
              style={{ borderRadius: "4px", border: "2px solid white" }}
            >
              <Text size="sm" fw={700} c="white">
                {leader}
              </Text>
            </Box>
          ))}
        </Group>

        <Grid gutter="xs" mt="xl">
          <Grid.Col span={6}>
            <Box></Box>
          </Grid.Col>

          <Grid.Col span={6}>
            <Box>
              <Group gap="xs"></Group>
            </Box>
          </Grid.Col>
        </Grid>

        <Group justify="space-between" align="center" mt="lg">
          <Group gap="xs">
            <Badge color="yellow" size="lg">
              Total Resources: {totalResources}
            </Badge>
            <Badge color="blue" size="lg">
              Total Influence: {totalInfluence}
            </Badge>
          </Group>
          <Group align="center">
            <Text size="xs">Neighbors:</Text>
            {neighbors.map((neighbor, index) => (
              <Tooltip key={index} label={neighbor}>
                <ActionIcon variant="outline" color="gray" size="sm">
                  <IconUsers size={16} />
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>
        </Group>

        <Box
          style={{
            position: "absolute",
            bottom: -20,
            right: -10,
            opacity: 0,
            zIndex: 0,
            pointerEvents: "none",
            height: "50%",
            overflow: "hidden",
          }}
          px={4}
          py={2}
        >
          <Image
            src="/sol.png"
            alt="faction"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
