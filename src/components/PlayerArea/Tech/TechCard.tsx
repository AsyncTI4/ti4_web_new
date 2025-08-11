import { Box, Text, Image, Stack } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";
import styles from "./TechCard.module.css";
import { getTechData, getTechTier } from "../../../lookup/tech";

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

type Props = {
  techId: string;
};

export function TechCard({ techId }: Props) {
  // Look up tech data
  const techData = getTechData(techId);

  if (!techData) {
    console.warn(`Tech with ID "${techId}" not found`);
    return null;
  }

  const color = getTechColor(techData.types[0]);
  const isFactionTech = !!techData.faction;
  const tier = getTechTier(techData.requirements);

  return (
    <Box className={`${styles.techCard} ${styles[color]}`}>
      {/* Content */}
      <Box className={`${styles.content} ${styles[color]}`}>
        <Stack gap="md" h="100%">
          {/* Header with faction icon if applicable */}
          <Box className={`${styles.header} ${styles[color]}`}>
            <Text
              size="md"
              fw={700}
              c="white"
              ff="heading"
              className={`${styles.title} ${isFactionTech ? styles.titleWithFaction : ""}`}
            >
              {techData.name}
            </Text>

            {/* Faction icon for faction techs */}
            {isFactionTech && (
              <Box className={styles.factionIcon}>
                <Image
                  src={cdnImage(`/factions/${techData.faction}.png`)}
                  alt={`${techData.faction} faction`}
                  w={24}
                  h={24}
                />
              </Box>
            )}
          </Box>

          {/* Description */}
          <Box className={styles.description}>
            <Text
              size="sm"
              fw={400}
              c="gray.2"
              className={styles.descriptionText}
            >
              {techData.text?.replace(/\n/g, "\n\n") ||
                "No description available."}
            </Text>
          </Box>

          {/* Bottom section with tech icon splayed diagonally by prereq tier (icon only, single background container) */}
          <Box className={styles.bottomSection}>
            {tier > 0 && (
              <Box className={`${styles.techIconContainer} ${styles[color]}`}>
                <Box className={styles.iconStack}>
                  {[...Array(tier)].map((_, i) => (
                    <Image
                      key={i}
                      src={`/${color}.png`}
                      alt={techData.name}
                      w={14}
                      h={14}
                      className={`${styles.stackIcon} ${styles[color]}`}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
