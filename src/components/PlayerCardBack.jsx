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
import { IconPlanet, IconRocket } from "@tabler/icons-react";

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
  cyan: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.6) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)",
    border: "rgba(6, 182, 212, 0.25)",
    shadow:
      "0 2px 8px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
  white: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)",
    border: "rgba(255, 255, 255, 0.15)",
    shadow:
      "0 2px 8px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  },
};

function Caption({ children, color = "gray.3" }) {
  return (
    <Text
      size="xs"
      c={color}
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
      {children}
    </Text>
  );
}

function ShimmerDivider() {
  return (
    <Box
      style={{
        height: "1px",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 20%, rgba(148, 163, 184, 0.3) 80%, transparent 100%)",
        margin: "2px 12px",
      }}
    />
  );
}

function ResourceInfluenceDisplay({
  resources,
  totalResources,
  influence,
  totalInfluence,
}) {
  return (
    <Stack gap="xs">
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
          {resources}
        </Text>
        <Text size="sm" c="yellow.5" fw={500} style={{ lineHeight: 1 }}>
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
          {influence}
        </Text>
        <Text size="sm" c="blue.5" fw={500} style={{ lineHeight: 1 }}>
          / {totalInfluence}
        </Text>
      </Group>
    </Stack>
  );
}

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
        minWidth: 0,
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
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Image
          src="/relicicon.webp"
          style={{
            width: "16px",
            height: "16px",
            filter: "drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3))",
            flexShrink: 0,
          }}
        />
        <Text
          size="sm"
          fw={700}
          c="white"
          style={{
            fontFamily: "SLIDER, monospace",
            textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
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
    grey: {
      background:
        "linear-gradient(90deg, rgba(107, 114, 128, 0.15) 0%, rgba(107, 114, 128, 0.08) 100%)",
      border: "rgba(107, 114, 128, 0.3)",
      leftBorder:
        "linear-gradient(180deg, rgba(107, 114, 128, 0.7) 0%, rgba(107, 114, 128, 0.3) 100%)",
      tierDot: "rgba(107, 114, 128, 0.9)",
      tierShadow:
        "0 0 3px rgba(107, 114, 128, 0.6), inset 0 0 1px rgba(255, 255, 255, 0.3)",
      iconFilter: "drop-shadow(0 0 3px rgba(107, 114, 128, 0.3))",
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
        <Group gap={4} style={{ position: "relative", minWidth: 0 }}>
          {/* Show faction icon for faction techs, otherwise show color icon */}
          {tech.isFaction ? (
            <Image
              src={tech.factionIcon || "/sol.png"}
              alt={tech.name}
              style={{
                width: "14px",
                height: "14px",
                filter: config.iconFilter,
                flexShrink: 0,
              }}
            />
          ) : (
            <Image
              src={`/${tech.color}.png`}
              alt={tech.name}
              style={{
                width: "14px",
                height: "14px",
                filter: config.iconFilter,
                flexShrink: 0,
              }}
            />
          )}
          <Text
            size="xs"
            c="white"
            fw={600}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              paddingRight: "16px",
              letterSpacing: "-0.05em",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "clip",
              minWidth: 0,
              flex: 1,
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

function Cardback({ src, alt, count, style, ...boxProps }) {
  return (
    <Box pos="relative" {...boxProps}>
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
          ...style,
        }}
      >
        <Image
          src={src}
          alt={alt}
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
          }}
        />
      </Box>
      <Box
        style={{
          position: "absolute",
          bottom: "4px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
          borderRadius: "4px",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
          minWidth: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            lineHeight: 1,
          }}
        >
          {count}
        </Text>
      </Box>
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
          background: colors.highlight,
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

function PromissoryNote({ name, factionIcon, isOtherFaction = false }) {
  const shimmerColor = isOtherFaction ? "cyan" : "blue";

  return (
    <Shimmer color={shimmerColor} py={2} px={6}>
      <Group gap="xs" align="center" style={{ minWidth: 0 }}>
        <Image src="/pnicon.png" style={{ width: "20px", flexShrink: 0 }} />
        <Text
          size="xs"
          fw={700}
          c="white"
          flex={1}
          style={{
            fontFamily: "SLIDER, monospace",
            textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Text>
        {factionIcon && (
          <Image
            src={factionIcon}
            style={{
              width: "20px",
              flexShrink: 0,
            }}
          />
        )}
      </Group>
    </Shimmer>
  );
}

function ScoredSecret({ text }) {
  return (
    <Shimmer color="red" p={2} px="sm">
      <Box
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <Image
          src="/so_icon.png"
          style={{
            width: "20px",
            height: "20px",
            filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
            flexShrink: 0,
          }}
        />
        <Text
          size="xs"
          fw={700}
          c="white"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: 1,
          }}
        >
          {text}
        </Text>
      </Box>
    </Shimmer>
  );
}

function FragmentStack({ count, type }) {
  const getFragmentSrc = () => {
    switch (type) {
      case "crf":
        return "/pa_fragment_crf.png";
      case "hrf":
        return "/pa_fragment_hrf.png";
      case "urf":
        return "/pa_fragment_urf.png";
      default:
        return "/pa_fragment_crf.png";
    }
  };

  const getFragmentSize = () => {
    // HRF fragments are slightly smaller
    return type === "hrf" ? "20px" : "25px";
  };

  const fragmentSrc = getFragmentSrc();
  const fragmentSize = getFragmentSize();

  // Don't render anything if count is 0
  if (count === 0) {
    return null;
  }

  // Render up to 3 fragments max for visual clarity
  const fragmentsToShow = Math.min(count, 3);

  return (
    <Group gap={0}>
      {Array.from({ length: fragmentsToShow }, (_, index) => (
        <Image
          key={index}
          src={fragmentSrc}
          style={{
            width: fragmentSize,
            marginLeft: index === 0 ? 0 : -8,
          }}
        />
      ))}
    </Group>
  );
}

export default function PlayerCardBack({
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
  isSpeaker = true,
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

            {/* Strategy Card and Speaker Token - moved to right side */}
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
              {isSpeaker && (
                <Box
                  p={6}
                  px={8}
                  style={{
                    borderRadius: "8px",
                    background:
                      "linear-gradient(145deg, rgba(15, 15, 20, 0.95) 0%, rgba(25, 25, 30, 0.9) 25%, rgba(20, 20, 25, 0.95) 50%, rgba(30, 30, 35, 0.9) 75%, rgba(15, 15, 20, 0.95) 100%)",
                    border: "2px solid rgba(239, 68, 68, 0.8)",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: "90px",
                    boxShadow:
                      "inset 2px 2px 6px rgba(0, 0, 0, 0.8), inset -1px -1px 3px rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {/* Shimmering red border overlay */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "-1px",
                      left: "-1px",
                      right: "-1px",
                      bottom: "-1px",
                      borderRadius: "9px",
                      background:
                        "linear-gradient(45deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 1) 25%, rgba(239, 68, 68, 0.7) 50%, rgba(185, 28, 28, 0.9) 75%, rgba(239, 68, 68, 0.9) 100%)",
                      padding: "2px",
                      zIndex: -1,
                    }}
                  >
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "7px",
                        background:
                          "linear-gradient(145deg, rgba(15, 15, 20, 0.95) 0%, rgba(25, 25, 30, 0.9) 25%, rgba(20, 20, 25, 0.95) 50%, rgba(30, 30, 35, 0.9) 75%, rgba(15, 15, 20, 0.95) 100%)",
                      }}
                    />
                  </Box>

                  {/* Brushed metal texture overlay */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `
                        repeating-linear-gradient(
                          90deg,
                          rgba(255, 255, 255, 0.02) 0px,
                          rgba(255, 255, 255, 0.01) 1px,
                          transparent 1px,
                          transparent 2px,
                          rgba(255, 255, 255, 0.015) 2px,
                          rgba(255, 255, 255, 0.005) 3px,
                          transparent 3px,
                          transparent 4px
                        )
                      `,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Top-right dark shadow for proper inset lighting */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "70%",
                      height: "70%",
                      background:
                        "linear-gradient(225deg, rgba(0, 0, 0, 0.5) 0%, transparent 60%)",
                      borderRadius: "0 8px 0 0",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Bottom-left highlight for proper inset lighting */}
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "60%",
                      height: "60%",
                      background:
                        "linear-gradient(45deg, rgba(255, 255, 255, 0.12) 0%, transparent 50%)",
                      borderRadius: "0 0 0 8px",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Red metallic glow */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 40%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />

                  <Group
                    justify="center"
                    align="center"
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <Text
                      ff="heading"
                      c="red.2"
                      size="sm"
                      fw={700}
                      style={{
                        textTransform: "uppercase",
                        textShadow:
                          "1px 1px 0px rgba(0, 0, 0, 0.9), 2px 2px 3px rgba(0, 0, 0, 0.8), 0 0 6px rgba(239, 68, 68, 0.3)",
                        letterSpacing: "1px",
                        fontSize: "11px",
                      }}
                    >
                      SPEAKER
                    </Text>
                  </Group>
                </Box>
              )}
            </Group>
          </Group>
        </Box>
        <Grid gutter="md" columns={12}>
          <Grid.Col
            span={3}
            style={{ marginBottom: -10, marginTop: -10, marginLeft: -10 }}
          >
            <Image
              src="/solpixelart.png"
              alt="faction"
              style={{
                height: "100%",
                // marginLeft: -15,
                // marginTop: -15,
              }}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <Box pos="relative">
              <ShimmerTopBottom
                color="white"
                style={{ borderLeftWidth: "1px" }}
              >
                <Text ff="heading" size="xl" c="white">
                  Federation of Sol
                </Text>
              </ShimmerTopBottom>
            </Box>

            {/* New Surface section with 3 columns */}
            <Surface p="sm" mt="sm">
              <Grid gutter="md" columns={12}>
                {/* Abilities Column */}
                <Grid.Col span={4}>
                  <Stack gap="sm">
                    <Caption>Abilities</Caption>
                    <Box
                      p="md"
                      style={{
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.1) 100%)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        boxShadow:
                          "0 4px 12px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Subtle glow overlay */}
                      <Box
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                          pointerEvents: "none",
                        }}
                      />

                      <Stack
                        gap="md"
                        style={{ position: "relative", zIndex: 1 }}
                      >
                        <Stack gap="sm">
                          <Box>
                            <Text
                              size="xs"
                              fw={700}
                              c="yellow.3"
                              style={{
                                textTransform: "uppercase",
                                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                                letterSpacing: "0.5px",
                              }}
                            >
                              ORBITAL DROP
                            </Text>
                            <Text
                              size="xs"
                              c="white"
                              style={{
                                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                                lineHeight: 1.4,
                                marginTop: "4px",
                              }}
                            >
                              ACTION: Spend 1 token from your strategy pool to
                              place 2 infantry from your reinforcements on 1
                              planet you control.
                            </Text>
                          </Box>

                          <Box>
                            <Text
                              size="xs"
                              fw={700}
                              c="yellow.3"
                              style={{
                                textTransform: "uppercase",
                                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                                letterSpacing: "0.5px",
                              }}
                            >
                              VERSATILE
                            </Text>
                            <Text
                              size="xs"
                              c="white"
                              style={{
                                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                                lineHeight: 1.4,
                                marginTop: "4px",
                              }}
                            >
                              When you gain command tokens during the status
                              phase, gain 1 additional command token.
                            </Text>
                          </Box>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid.Col>

                {/* Faction Technologies Column */}
                <Grid.Col span={4}>
                  <Stack gap="sm">
                    <Caption>Faction Technologies</Caption>
                    {/* Placeholder for faction tech content */}
                    <Box
                      p="md"
                      style={{
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.1) 100%)",
                        border: "1px solid rgba(107, 114, 128, 0.3)",
                        boxShadow:
                          "0 4px 12px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        minHeight: "120px",
                      }}
                    >
                      <Text
                        size="xs"
                        c="gray.4"
                        style={{ textAlign: "center", marginTop: "40px" }}
                      >
                        Faction Technologies
                      </Text>
                    </Box>
                  </Stack>
                </Grid.Col>

                {/* Leaders Column */}
                <Grid.Col span={4}>
                  <Stack gap="sm">
                    <Caption>Leaders</Caption>
                    <Stack gap="xs">
                      {/* Agent - Evelyn Delouis */}
                      <Box
                        p="sm"
                        style={{
                          borderRadius: "8px",
                          background:
                            "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.08) 100%)",
                          border: "1px solid rgba(34, 197, 94, 0.25)",
                          boxShadow:
                            "0 2px 6px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Group gap="xs" align="flex-start">
                          <Image
                            src="/commanders/solagent.webp"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "4px",
                              flexShrink: 0,
                            }}
                          />
                          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                            <Group gap="xs" align="center">
                              <Text
                                size="xs"
                                fw={700}
                                c="green.3"
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: "10px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                AGENT
                              </Text>
                              <Text
                                size="sm"
                                fw={600}
                                c="white"
                                style={{ fontSize: "12px" }}
                              >
                                Evelyn Delouis
                              </Text>
                            </Group>
                            <Text
                              size="xs"
                              c="gray.4"
                              style={{
                                fontSize: "10px",
                                lineHeight: 1.3,
                                fontStyle: "italic",
                              }}
                            >
                              At Game Start
                            </Text>
                            <Text
                              size="sm"
                              c="white"
                              style={{
                                fontSize: "11px",
                                lineHeight: 1.4,
                              }}
                            >
                              At the start of a ground combat round: You may
                              exhaust this card to choose 1 ground force in the
                              active system; that ground force rolls 1
                              additional die during that combat round.
                            </Text>
                          </Stack>
                        </Group>
                      </Box>

                      {/* Commander - Claire Gibson */}
                      <Box
                        p="sm"
                        style={{
                          borderRadius: "8px",
                          background:
                            "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%)",
                          border: "1px solid rgba(59, 130, 246, 0.25)",
                          boxShadow:
                            "0 2px 6px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Group gap="xs" align="flex-start">
                          <Image
                            src="/commanders/solcommander.webp"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "4px",
                              flexShrink: 0,
                            }}
                          />
                          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                            <Group gap="xs" align="center">
                              <Text
                                size="xs"
                                fw={700}
                                c="blue.3"
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: "10px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                COMMANDER
                              </Text>
                              <Text
                                size="sm"
                                fw={600}
                                c="white"
                                style={{ fontSize: "12px" }}
                              >
                                Claire Gibson
                              </Text>
                            </Group>
                            <Text
                              size="xs"
                              c="gray.4"
                              style={{
                                fontSize: "10px",
                                lineHeight: 1.3,
                                fontStyle: "italic",
                              }}
                            >
                              Control planets that have a combined total of at
                              least 12 resources.
                            </Text>
                            <Text
                              size="sm"
                              c="white"
                              style={{
                                fontSize: "11px",
                                lineHeight: 1.4,
                              }}
                            >
                              At the start of a ground combat on a planet you
                              control: You may place 1 infantry from your
                              reinforcements on that planet.
                            </Text>
                          </Stack>
                        </Group>
                      </Box>

                      {/* Hero - Jace X. 4th Air Legion */}
                      <Box
                        p="sm"
                        style={{
                          borderRadius: "8px",
                          background:
                            "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)",
                          border: "1px solid rgba(251, 191, 36, 0.25)",
                          boxShadow:
                            "0 2px 6px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Group gap="xs" align="flex-start">
                          <Image
                            src="/commanders/solhero.webp"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "4px",
                              flexShrink: 0,
                            }}
                          />
                          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                            <Group gap="xs" align="center">
                              <Text
                                size="xs"
                                fw={700}
                                c="yellow.3"
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: "10px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                HERO
                              </Text>
                              <Text
                                size="sm"
                                fw={600}
                                c="white"
                                style={{ fontSize: "12px" }}
                              >
                                Jace X. 4th Air Legion
                              </Text>
                            </Group>
                            <Text
                              size="xs"
                              c="gray.4"
                              style={{
                                fontSize: "10px",
                                lineHeight: 1.3,
                                fontStyle: "italic",
                              }}
                            >
                              Have 3 Scored Objectives
                            </Text>
                            <Text
                              size="sm"
                              fw={600}
                              c="yellow.3"
                              style={{
                                fontSize: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              HELIO COMMAND ARRAY
                            </Text>
                            <Text
                              size="sm"
                              c="white"
                              style={{
                                fontSize: "11px",
                                lineHeight: 1.4,
                              }}
                            >
                              ACTION: Remove each of your command tokens from
                              the game board and return them to your
                              reinforcements. Then, purge this card.
                            </Text>
                          </Stack>
                        </Group>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Surface>
          </Grid.Col>
        </Grid>
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

function ShimmerTopBottom({ color = "blue", children, ...boxProps }) {
  const shimmerConfig = SHIMMER_COLORS[color] || SHIMMER_COLORS.blue;

  return (
    <Box
      style={{
        borderRadius: "8px",
        background: shimmerConfig.background,
        borderTop: `1px solid ${shimmerConfig.border}`,
        borderBottom: `1px solid ${shimmerConfig.border}`,
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

      <Box style={{ position: "relative", zIndex: 1, padding: "8px 12px" }}>
        {children}
      </Box>
    </Box>
  );
}
