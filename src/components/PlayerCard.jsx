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
  Table,
} from "@mantine/core";
import InfluenceIcon from "./InfluenceIcon";

// Planet color configurations by trait
const PLANET_COLORS = {
  cultural: {
    background: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.3)",
    shadow: "rgba(59, 130, 246, 0.08)",
    highlight: "rgba(59, 130, 246, 0.4)",
  },
  hazardous: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    shadow: "rgba(239, 68, 68, 0.08)",
    highlight: "rgba(239, 68, 68, 0.4)",
  },
  industrial: {
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.3)",
    shadow: "rgba(34, 197, 94, 0.08)",
    highlight: "rgba(34, 197, 94, 0.4)",
  },
  // Default for planets without traits (like Mecatol Rex)
  default: {
    background: "rgba(107, 114, 128, 0.12)",
    border: "rgba(107, 114, 128, 0.3)",
    shadow: "rgba(107, 114, 128, 0.08)",
    highlight: "rgba(107, 114, 128, 0.4)",
  },
};

// Shimmer color configurations
const SHIMMER_COLORS = {
  red: {
    gradient:
      "linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
    border: "rgba(239, 68, 68, 0.25)",
    shadow:
      "0 4px 12px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  green: {
    gradient:
      "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
    border: "rgba(34, 197, 94, 0.25)",
    shadow:
      "0 4px 12px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  blue: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)",
    border: "rgba(59, 130, 246, 0.25)",
    shadow:
      "0 2px 8px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
};

function Relic({ name }) {
  return (
    <Box
      py={4}
      px={6}
      style={{
        borderRadius: "6px",
        background:
          "linear-gradient(135deg, rgba(194, 65, 12, 0.15) 0%, rgba(234, 88, 12, 0.12) 50%, rgba(194, 65, 12, 0.15) 100%)",
        border: "1px solid rgba(251, 191, 36, 0.4)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal stripe pattern */}
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
              rgba(251, 191, 36, 0.08) 0px,
              rgba(251, 191, 36, 0.08) 1px,
              transparent 1px,
              transparent 16px
            )
          `,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Stronger inner glow */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
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
            width: "16px",
            height: "16px",
            filter: "drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3))",
          }}
        />
        <Text
          size="sm"
          fw={700}
          c="white"
          style={{
            fontFamily: "SLIDER, monospace",
            textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
          }}
        >
          {name}
        </Text>
      </Box>
    </Box>
  );
}

function Tech({ tech }) {
  const colorConfig = {
    blue: {
      background:
        "linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
      border: "rgba(59, 130, 246, 0.2)",
      leftBorder:
        "linear-gradient(180deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.2) 100%)",
      tierDot: "rgba(59, 130, 246, 0.9)",
      tierShadow:
        "0 0 3px rgba(59, 130, 246, 0.6), inset 0 0 1px rgba(255, 255, 255, 0.3)",
      iconFilter: "drop-shadow(0 0 3px rgba(59, 130, 246, 0.3))",
    },
    yellow: {
      background:
        "linear-gradient(90deg, rgba(234, 179, 8, 0.1) 0%, rgba(234, 179, 8, 0.05) 100%)",
      border: "rgba(234, 179, 8, 0.2)",
      leftBorder:
        "linear-gradient(180deg, rgba(234, 179, 8, 0.6) 0%, rgba(234, 179, 8, 0.2) 100%)",
      tierDot: "rgba(234, 179, 8, 0.9)",
      tierShadow:
        "0 0 3px rgba(234, 179, 8, 0.6), inset 0 0 1px rgba(255, 255, 255, 0.3)",
      iconFilter: "drop-shadow(0 0 3px rgba(234, 179, 8, 0.3))",
    },
    green: {
      background:
        "linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
      border: "rgba(34, 197, 94, 0.2)",
      leftBorder:
        "linear-gradient(180deg, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 100%)",
      tierDot: "rgba(34, 197, 94, 0.9)",
      tierShadow:
        "0 0 3px rgba(34, 197, 94, 0.6), inset 0 0 1px rgba(255, 255, 255, 0.3)",
      iconFilter: "drop-shadow(0 0 3px rgba(34, 197, 94, 0.3))",
    },
    red: {
      background:
        "linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
      border: "rgba(239, 68, 68, 0.2)",
      leftBorder:
        "linear-gradient(180deg, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.2) 100%)",
      tierDot: "rgba(239, 68, 68, 0.9)",
      tierShadow:
        "0 0 3px rgba(239, 68, 68, 0.6), inset 0 0 1px rgba(255, 255, 255, 0.3)",
      iconFilter: "drop-shadow(0 0 3px rgba(239, 68, 68, 0.3))",
    },
  };

  const config = colorConfig[tech.color] || colorConfig.blue;

  return (
    <Tooltip label={tech.name}>
      <Box
        py={1}
        px="xs"
        style={{
          borderRadius: "4px",
          background: config.background,
          border: `1px solid ${config.border}`,
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
            background: config.leftBorder,
          }}
        />
        {/* Tier indicator dots in top-right */}
        {tech.tier > 0 && (
          <Box
            style={{
              position: "absolute",
              top: "3px",
              right: "4px",
              display: "flex",
              gap: "2px",
              flexWrap: "wrap",
              width: "12px",
              justifyContent: "flex-end",
            }}
          >
            {[...Array(tech.tier)].map((_, dotIndex) => (
              <Box
                key={dotIndex}
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: config.tierDot,
                  boxShadow: config.tierShadow,
                }}
              />
            ))}
          </Box>
        )}
        <Group gap={4} style={{ position: "relative" }}>
          <Image
            src={`/${tech.color}.png`}
            alt={tech.name}
            style={{
              width: "14px",
              height: "14px",
              filter: config.iconFilter,
            }}
          />
          <Text
            size="xs"
            c="white"
            fw={600}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              paddingRight: "16px",
            }}
          >
            {tech.name}
          </Text>
        </Group>
      </Box>
    </Tooltip>
  );
}

function Surface({
  children,
  pattern = "none",
  label,
  cornerAccents = false,
  ...boxProps
}) {
  const getPatternOverlay = () => {
    switch (pattern) {
      case "grid":
        return {
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        };
      case "circle":
        return {
          backgroundColor: "rgba(148, 163, 184, 0.02)",
          backgroundImage:
            "repeating-radial-gradient(circle at 0 0, transparent 0, rgba(148, 163, 184, 0.02) 10px), repeating-linear-gradient(rgba(148, 163, 184, 0.03), rgba(148, 163, 184, 0.01))",
        };
      default:
        return {};
    }
  };

  return (
    <Box
      {...boxProps}
      style={{
        borderRadius: "12px",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
        ...boxProps.style,
      }}
    >
      {/* Pattern overlay */}
      {pattern !== "none" && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            opacity: 0.5,
            ...getPatternOverlay(),
          }}
        />
      )}

      {/* Corner accents */}
      {cornerAccents && (
        <>
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
        </>
      )}

      {/* Label */}
      {label && (
        <Text
          size="xs"
          fw={700}
          c="blueGray.3"
          style={{
            textTransform: "uppercase",
            bottom: 15,
            position: "absolute",
            right: 20,
            zIndex: 1,
          }}
        >
          {label}
        </Text>
      )}

      {children}
    </Box>
  );
}

function Shimmer({ color = "blue", children, ...boxProps }) {
  const shimmerConfig = SHIMMER_COLORS[color] || SHIMMER_COLORS.blue;

  return (
    <Box
      style={{
        borderRadius: "8px",
        background: shimmerConfig.background,
        border: `1px solid ${shimmerConfig.border}`,
        position: "relative",
        overflow: "hidden",
        boxShadow: shimmerConfig.shadow,
        ...boxProps.style,
      }}
      {...boxProps}
    >
      {/* Top shimmer */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: shimmerConfig.gradient,
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
          background: shimmerConfig.gradient,
        }}
      />

      {/* Subtle diagonal pattern for blue shimmers */}
      {color === "blue" && (
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
                rgba(59, 130, 246, 0.03) 0px,
                rgba(59, 130, 246, 0.03) 1px,
                transparent 1px,
                transparent 16px
              )
            `,
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />
      )}

      {children}
    </Box>
  );
}

function PlanetCard({ planet, planetTraitIcons, techSkipIcons }) {
  const colors = PLANET_COLORS[planet.trait] || PLANET_COLORS.default;

  return (
    <Stack
      py={6}
      px={3}
      justify="space-between"
      h={140}
      style={{
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${colors.background} 0%, rgba(15, 23, 42, 0.6) 100%)`,
        border: `1px solid ${colors.border}`,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 2px 8px ${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
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
          background: `linear-gradient(90deg, transparent 0%, ${colors.highlight} 50%, transparent 100%)`,
        }}
      />

      <Box align="center">{planet.trait && planetTraitIcons[planet.trait]}</Box>
      <Stack gap={4} style={{ position: "relative", zIndex: 1 }}>
        <Group gap={0} align="flex-end">
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
          <Stack gap={2} align="top">
            {planet.techSkip && techSkipIcons[planet.techSkip]}
            <Box
              pos="relative"
              style={{
                width: "16px",
                height: "16px",
              }}
            >
              <Image
                src="/pa_resources.png"
                style={{
                  width: "16px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  // height: "16px",
                }}
              />
              <Text
                size="xs"
                c="white"
                fw={700}
                style={{
                  position: "absolute",
                  top: 1,
                  left: 5,
                }}
              >
                {planet.resources}
              </Text>
            </Box>

            <Box
              pos="relative"
              style={{
                width: "16px",
                height: "16px",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <InfluenceIcon size={18} />
              </Box>
              <Text
                size="xs"
                c="white"
                fw={700}
                style={{ position: "absolute", top: 2, left: 5 }}
              >
                {planet.influence}
              </Text>
            </Box>
          </Stack>
        </Group>
      </Stack>
    </Stack>
  );
}

function Leader({ imageUrl, title, description, active = false }) {
  if (active) {
    return (
      <Shimmer color="green" p={2} px="sm">
        <Group
          style={{
            position: "relative",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Image
            src={imageUrl}
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
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              {title}
            </Text>
            <Text size="xs" c="green.3" fw={500} style={{ opacity: 0.8 }}>
              {description}
            </Text>
          </Stack>
        </Group>
      </Shimmer>
    );
  }

  return (
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
        width: "100%",
      }}
    >
      <Group
        style={{
          position: "relative",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Image
          src={imageUrl}
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
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {title}
          </Text>
          <Text size="xs" c="gray.5" fw={500} style={{ opacity: 0.8 }}>
            {description}
          </Text>
        </Stack>
      </Group>
    </Group>
  );
}

function PromissoryNote({ name, factionIcon }) {
  return (
    <Shimmer color="blue" py={2} px={6}>
      <Group justify="space-between">
        <Box
          style={{
            display: "flex",
            gap: "10px",
            height: "100%",
            position: "relative",
          }}
        >
          <Image src="/pnicon.png" style={{ width: "20px" }} />
          <Text
            size="xs"
            fw={700}
            c="white"
            style={{
              fontFamily: "SLIDER, monospace",
              textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            {name}
          </Text>
        </Box>
        {factionIcon && <Image src={factionIcon} style={{ width: "20px" }} />}
      </Group>
    </Shimmer>
  );
}

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
        <Grid gutter="md" columns={12}>
          <Grid.Col span={2}>
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
                <Group gap={4} px={4}>
                  <Text span c="white" size="lg" ff="heading">
                    {playerName}
                  </Text>
                  <Text
                    size="md"
                    span
                    ml={4}
                    opacity={0.9}
                    c="white"
                    ff="heading"
                  >
                    [{faction}]
                  </Text>
                  <Text size="sm" span ml={4} ff="heading" c="pink">
                    (pink)
                  </Text>
                </Group>
              </Group>
            </Box>
            <Stack>
              <Shimmer
                color="red"
                p={2}
                px="sm"
                pl="lg"
                pos="relative"
                align="center"
                display="flex"
              >
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
                    left: "0px",
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
                    padding: "0 24px",
                  }}
                >
                  LEADERSHIP
                </Text>
              </Shimmer>

              <Group gap={6} justify="center">
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
              <Group gap="xs" justify="center">
                <Group gap={0}>
                  <Image src="/pa_fragment_crf.png" style={{ width: "25px" }} />
                  <Image
                    src="/pa_fragment_crf.png"
                    style={{ width: "25px", marginLeft: -8 }}
                  />
                  <Image
                    src="/pa_fragment_crf.png"
                    style={{ width: "25px", marginLeft: -8 }}
                  />
                </Group>
                <Group gap={0}>
                  <Image src="/pa_fragment_hrf.png" style={{ width: "20px" }} />
                  <Image
                    src="/pa_fragment_hrf.png"
                    style={{ width: "25px", marginLeft: -8 }}
                  />
                  <Image
                    src="/pa_fragment_hrf.png"
                    style={{ width: "25px", marginLeft: -8 }}
                  />
                </Group>
                <Group gap={0}>
                  <Image src="/pa_fragment_urf.png" style={{ width: "25px" }} />
                  <Image
                    src="/pa_fragment_urf.png"
                    style={{ width: "25px", marginLeft: -8 }}
                  />
                  <Image
                    src="/pa_fragment_urf.png"
                    style={{ width: "25px", marginLeft: -8 }}
                  />
                </Group>
              </Group>
              <Stack gap={2}>
                {scoredSecrets.map((secret, index) => (
                  <Shimmer key={index} color="red" p={2} px="sm">
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
                  </Shimmer>
                ))}
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack gap="md">
              <Surface
                pattern="grid"
                cornerAccents={true}
                label="TECH"
                p="md"
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Group gap="xs" align="top" flex={1}>
                  <Stack gap={4}>
                    {techs
                      .filter((v) => v.color === "blue")
                      .map((tech, index) => (
                        <Tech key={index} tech={tech} />
                      ))}
                  </Stack>
                  <Stack gap={4}>
                    {techs
                      .filter((v) => v.color === "yellow")
                      .map((tech, index) => (
                        <Tech key={index} tech={tech} />
                      ))}
                  </Stack>
                  <Stack gap={4}>
                    {techs
                      .filter((v) => v.color === "green")
                      .map((tech, index) => (
                        <Tech key={index} tech={tech} />
                      ))}
                  </Stack>
                  <Stack gap={4}>
                    {techs
                      .filter((v) => v.color === "red")
                      .map((tech, index) => (
                        <Tech key={index} tech={tech} />
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
              </Surface>

              <Group gap="md" align="stretch">
                <Surface w={200} p="md" pattern="none" cornerAccents>
                  <Stack
                    justify="center"
                    h="100%"
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    {/* Total Section */}
                    <Stack gap="sm">
                      <Text
                        size="xs"
                        c="gray.3"
                        opacity={0.6}
                        fw={700}
                        style={{
                          textTransform: "uppercase",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                          alignSelf: "flex-start",
                          fontSize: "10px",
                          lineHeight: 1,
                        }}
                      >
                        Total
                      </Text>
                      <Group gap="lg" justify="center">
                        {/* Resources */}
                        <Group gap={4} align="baseline">
                          <svg width="12" height="12" viewBox="0 0 24 24">
                            <polygon
                              points="6,2 18,2 22,12 18,22 6,22 2,12"
                              fill="transparent"
                              stroke="#eab308"
                              strokeWidth="2"
                            />
                          </svg>
                          <Text
                            size="lg"
                            fw={700}
                            c="yellow.3"
                            style={{
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                              lineHeight: 1,
                            }}
                          >
                            {totalResources - 3}
                          </Text>
                          <Text
                            size="sm"
                            c="yellow.5"
                            fw={500}
                            style={{ lineHeight: 1 }}
                          >
                            / {totalResources}
                          </Text>
                        </Group>
                        {/* Influence */}
                        <Group gap={4} align="baseline">
                          <InfluenceIcon size={12} />
                          <Text
                            size="lg"
                            fw={700}
                            c="blue.3"
                            style={{
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                              lineHeight: 1,
                            }}
                          >
                            {totalInfluence - 1}
                          </Text>
                          <Text
                            size="sm"
                            c="blue.5"
                            fw={500}
                            style={{ lineHeight: 1 }}
                          >
                            / {totalInfluence}
                          </Text>
                        </Group>
                      </Group>
                    </Stack>

                    {/* Divider */}
                    <Box
                      style={{
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 20%, rgba(148, 163, 184, 0.3) 80%, transparent 100%)",
                        margin: "2px 12px",
                      }}
                    />

                    {/* Optimal Section */}
                    <Stack gap="sm">
                      <Text
                        size="xs"
                        c="gray.3"
                        opacity={0.6}
                        fw={700}
                        style={{
                          textTransform: "uppercase",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                          alignSelf: "flex-start",
                          fontSize: "10px",
                          lineHeight: 1,
                        }}
                      >
                        Optimal
                      </Text>
                      <Group gap="lg" justify="center">
                        {/* Resources */}
                        <Group gap={4} align="baseline">
                          <svg width="12" height="12" viewBox="0 0 24 24">
                            <polygon
                              points="6,2 18,2 22,12 18,22 6,22 2,12"
                              fill="transparent"
                              stroke="#eab308"
                              strokeWidth="2"
                            />
                          </svg>
                          <Text
                            size="lg"
                            fw={700}
                            c="yellow.3"
                            style={{
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                              lineHeight: 1,
                            }}
                          >
                            {totalResources - 3}
                          </Text>
                          <Text
                            size="sm"
                            c="yellow.5"
                            fw={500}
                            style={{ lineHeight: 1 }}
                          >
                            / {totalResources}
                          </Text>
                        </Group>
                        {/* Influence */}
                        <Group gap={4} align="baseline">
                          <InfluenceIcon size={12} />
                          <Text
                            size="lg"
                            fw={700}
                            c="blue.3"
                            style={{
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                              lineHeight: 1,
                            }}
                          >
                            {totalInfluence - 1}
                          </Text>
                          <Text
                            size="sm"
                            c="blue.5"
                            fw={500}
                            style={{ lineHeight: 1 }}
                          >
                            / {totalInfluence}
                          </Text>
                        </Group>
                      </Group>
                    </Stack>
                  </Stack>
                </Surface>

                <Surface
                  flex={1}
                  p="md"
                  pattern="circle"
                  cornerAccents={true}
                  label="Planets"
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
            </Stack>
          </Grid.Col>
          <Grid.Col span={4}>
            <Group justify="space-between" align="start">
              <Stack>
                <Group align="start">
                  <Stack gap={4}>
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
                  <Stack gap={4}>
                    {relics.map((relic, index) => (
                      <Relic key={index} name={relic} />
                    ))}
                  </Stack>
                </Group>
                <Group gap={4}>
                  <Stack gap={4}>
                    <PromissoryNote
                      name="Alliance"
                      factionIcon="/factions/hacan.png"
                    />
                    <PromissoryNote
                      name="Support for the Throne"
                      factionIcon="/factions/titans.png"
                    />
                    <PromissoryNote
                      name="Alliance"
                      factionIcon="/factions/letnev.png"
                    />
                  </Stack>
                </Group>
              </Stack>

              <Box style={{ zoom: 0.8 }}>
                <Table horizontalSpacing={6} verticalSpacing={4}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: "22px" }}></Table.Th>
                      <Table.Th>Space</Table.Th>
                      <Table.Th>Ground</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        <Image src="/pa_health.png" style={{ width: "20px" }} />
                      </Table.Td>
                      <Table.Td>
                        <Text size="md" fw={700} c="white">
                          8
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="md" fw={700} c="white">
                          12
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Image src="/pa_hit.png" style={{ width: "20px" }} />
                      </Table.Td>
                      <Table.Td>
                        <Text size="md" fw={700} c="white">
                          4
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="md" fw={700} c="white">
                          6
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Image
                          src="/pa_unitimage.png"
                          style={{ width: "20px" }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text size="md" fw={700} c="white">
                          2
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="md" fw={700} c="white">
                          3
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Box>
            </Group>
          </Grid.Col>
        </Grid>

        <Box
          style={{
            position: "absolute",
            bottom: -5,
            right: -30,
            opacity: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 50%, rgba(15, 23, 42, 0.5) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderBottomLeftRadius: 0,
            padding: "10px",
            borderRadius: "10px",
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
            backdropFilter: "blur(3px)",
          }}
          px={4}
          py={2}
        >
          <Image
            src="/pa_reinforcements.png"
            style={{
              width: "280px",
            }}
          />
        </Box>
      </Box>

      <Box
        style={{
          position: "absolute",
          bottom: -60,
          right: -40,
          opacity: 0.15,
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
