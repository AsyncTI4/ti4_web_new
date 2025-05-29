import { Box, Group, Text, Image, Tooltip } from "@mantine/core";
import { techs } from "../../../data/tech";
import styles from "./Tech.module.css";
import { cdnImage } from "../../../data/cdnImage";

// Helper function to get tech color from type
const getTechColor = (techType: string): string => {
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
  const isFactionTech = !!techData.faction;

  return (
    <Tooltip label={techData.name}>
      <Box py={1} px="xs" className={`${styles.techCard} ${styles[color]}`}>
        {/* Faction icon for faction techs - positioned before tier dots */}
        {isFactionTech && (
          <Box pos="absolute" top={3} right={tier > 0 ? 20 : 4}>
            <Image
              src={cdnImage(`/factions/${techData.faction}.png`)}
              alt={`${techData.faction} faction`}
              w={14}
              h={14}
              style={{
                flexShrink: 0,
              }}
            />
          </Box>
        )}

        {/* Tier indicator dots in top-right */}
        {tier > 0 && (
          <Box
            pos="absolute"
            top={3}
            right={4}
            display="flex"
            w={12}
            style={{
              gap: "2px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {[...Array(tier)].map((_, dotIndex) => (
              <Box
                key={dotIndex}
                className={`${styles.tierDot} ${styles[color]}`}
              />
            ))}
          </Box>
        )}
        <Group gap={4} pos="relative" miw={0}>
          <Image
            src={`/${color}.png`}
            alt={techData.name}
            className={`${styles.iconFilter} ${styles[color]}`}
            w={14}
            h={14}
            style={{
              flexShrink: 0,
            }}
          />
          <Text
            size="xs"
            c="white"
            fw={600}
            ff="monospace"
            flex={1}
            miw={0}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              paddingRight: "16px",
              letterSpacing: "-0.05em",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "clip",
            }}
          >
            {techData.name}
          </Text>
        </Group>
      </Box>
    </Tooltip>
  );
}
