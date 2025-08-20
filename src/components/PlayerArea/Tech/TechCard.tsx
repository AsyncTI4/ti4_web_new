import { Box, Image, Stack } from "@mantine/core";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { CircularFactionIcon } from "@/components/shared/CircularFactionIcon";
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
  const techData = getTechData(techId);

  if (!techData) {
    console.warn(`Tech with ID "${techId}" not found`);
    return null;
  }

  const color = getTechColor(techData.types[0]);
  const isFactionTech = !!techData.faction;
  const tier = getTechTier(techData.requirements);

  const detailsCardColor =
    color === "grey" ? "none" : (color as "blue" | "green" | "red" | "yellow");

  const formatType = (type: string) => {
    if (type === "PROPULSION") return "Propulsion";
    if (type === "BIOTIC") return "Biotic";
    if (type === "WARFARE") return "Warfare";
    if (type === "CYBERNETIC") return "Cybernetic";
    return type;
  };

  const techIconSrc = color === "grey" ? undefined : (`/${color}.png` as const);

  return (
    <DetailsCard
      width={320}
      color={detailsCardColor}
      className={styles.content}
    >
      <Stack gap="md" h="100%">
        <DetailsCard.Title
          title={techData.name}
          subtitle={`${formatType(techData.types[0])} Technology`}
          icon={
            techIconSrc ? (
              <DetailsCard.Icon
                icon={<Image src={techIconSrc} w={28} h={28} />}
              />
            ) : undefined
          }
          caption={isFactionTech ? "Faction Tech" : undefined}
          captionColor="blue"
        />

        {isFactionTech && techData.faction && (
          <Box className={styles.factionIcon}>
            <CircularFactionIcon faction={techData.faction} size={24} />
          </Box>
        )}

        <DetailsCard.Section
          content={
            techData.text?.replace(/\n/g, "\n\n") || "No description available."
          }
        />

        <Box className={styles.bottomSection}>
          {tier > 0 && (
            <Box className={styles.techIconContainer}>
              <Box className={styles.iconStack}>
                {[...Array(tier)].map((_, i) => (
                  <Image
                    key={i}
                    src={`/${color}.png`}
                    alt={techData.name}
                    w={14}
                    h={14}
                    className={styles.stackIcon}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
    </DetailsCard>
  );
}
