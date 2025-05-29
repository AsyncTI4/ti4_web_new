import { Box, Group, Text, Image, Tooltip } from "@mantine/core";
import { techs } from "../../../data/tech";
import { getGradientClasses, ColorKey } from "../gradientClasses";

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
  const gradientClasses = getGradientClasses(color);

  return (
    <Tooltip label={techData.name}>
      <Box py={1} px="xs" className={gradientClasses.techCard}>
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
              <Box key={dotIndex} className={gradientClasses.tierDot} />
            ))}
          </Box>
        )}
        <Group gap={4} style={{ position: "relative", minWidth: 0 }}>
          <Image
            src={`/${color}.png`}
            alt={techData.name}
            className={gradientClasses.iconFilter}
            style={{
              width: "14px",
              height: "14px",
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
