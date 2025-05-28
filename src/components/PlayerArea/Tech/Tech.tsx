import { Box, Group, Text, Image, Tooltip } from "@mantine/core";
import { techs } from "../../../data/tech";

// Tech color configurations
const TECH_COLOR_CONFIG = {
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

type TechColor = keyof typeof TECH_COLOR_CONFIG;

// Helper function to get tech color from type
const getTechColor = (techType: string): TechColor => {
  switch (techType) {
    case "PROPULSION":
      return "blue";
    case "BIOTIC":
      return "green";
    case "WARFARE":
      return "red";
    case "CYBERNETIC":
      return "yellow";
    default:
      return "grey";
  }
};

// Helper function to get tier from requirements
const getTechTier = (requirements?: string): number => {
  if (!requirements) return 0;

  // Count the number of same letters (e.g., "BB" = 2, "BBB" = 3)
  const matches = requirements.match(/(.)\1*/g);
  if (matches && matches.length > 0) {
    return matches[0].length;
  }

  return 0;
};

type Props = {
  techId: string;
};

export function Tech({ techId }: Props) {
  // Look up tech data
  const techData = techs.find((tech) => tech.alias === techId);

  if (!techData) {
    console.warn(`Tech with ID "${techId}" not found`);
    return null;
  }

  const color = getTechColor(techData.types[0]);
  const tier = getTechTier(techData.requirements);
  const config = TECH_COLOR_CONFIG[color] || TECH_COLOR_CONFIG.blue;

  return (
    <Tooltip label={techData.name}>
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
        {tier > 0 && (
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
            {[...Array(tier)].map((_, dotIndex) => (
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
          <Image
            src={`/${color}.png`}
            alt={techData.name}
            style={{
              width: "14px",
              height: "14px",
              filter: config.iconFilter,
              flexShrink: 0,
            }}
          />
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
            {techData.name}
          </Text>
        </Group>
      </Box>
    </Tooltip>
  );
}
