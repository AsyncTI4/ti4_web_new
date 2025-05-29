import { Box, Group, Text, Image, Tooltip } from "@mantine/core";
import { techs } from "../../../data/tech";
import { getGradientConfig, ColorKey } from "../gradients";

// Helper function to get tech color from type
const getTechColor = (techType: string): ColorKey => {
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
  const gradientConfig = getGradientConfig(color);

  return (
    <Tooltip label={techData.name}>
      <Box
        py={1}
        px="xs"
        style={{
          borderRadius: "4px",
          background: gradientConfig.background,
          border: `1px solid ${gradientConfig.border}`,
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
            background: gradientConfig.leftBorder,
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
                  background: gradientConfig.accent,
                  boxShadow: `0 0 3px ${gradientConfig.accent}, inset 0 0 1px rgba(255, 255, 255, 0.3)`,
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
              filter: gradientConfig.iconFilter,
              flexShrink: 0,
            }}
          />
          <Text
            size="xs"
            c="white"
            fw={600}
            ff="monospace"
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
