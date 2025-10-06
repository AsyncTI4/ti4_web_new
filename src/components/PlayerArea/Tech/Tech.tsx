import { Box, Group, Text, Image } from "@mantine/core";
import styles from "./Tech.module.css";
import { cdnImage } from "../../../data/cdnImage";
import { TechCard } from "./TechCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import { getTechData } from "../../../lookup/tech";
import { isMobileDevice } from "@/utils/isTouchDevice";

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
      return "gray";
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
  isExhausted?: boolean;
};

export function Tech({ techId, isExhausted = false }: Props) {
  const [opened, setOpened] = useState(false);

  // Look up tech data
  const techData = getTechData(techId);

  if (!techData) {
    console.warn(`Tech with ID "${techId}" not found`);
    return null;
  }

  const color = getTechColor(techData.types[0]);
  const tier = getTechTier(techData.requirements);
  const isFactionTech = !!techData.faction;
  const isEnhanced = tier === 3 || isFactionTech;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box
          className={`${styles.techCard} ${styles[color]} ${isFactionTech ? styles.factionTech : ""} ${isEnhanced ? styles.enhanced : ""}`}
          onClick={() => setOpened((o) => !o)}
          style={{ opacity: isExhausted ? 0.5 : 1 }}
        >
          {/* Tier indicator dots in top-right */}
          {tier > 0 && (
            <Box className={styles.tierContainer}>
              {[...Array(tier)].map((_, dotIndex) => (
                <Box
                  key={dotIndex}
                  className={`${styles.tierDot} ${styles[color]}`}
                />
              ))}
            </Box>
          )}
          <Group className={styles.contentGroup}>
            {isFactionTech ? (
              <Box
                className={`${styles.techIcon} ${styles.factionTechIcon} ${styles[color]}`}
              >
                <Image
                  src={cdnImage(`/factions/${techData.faction}.png`)}
                  alt={`${techData.faction} faction`}
                />
              </Box>
            ) : (
              <Image
                src={
                  isFactionTech
                    ? cdnImage(`/factions/${techData.faction}.png`)
                    : `/${color}.png`
                }
                alt={techData.name}
                className={`${styles.techIcon} ${styles[color]}`}
              />
            )}
            <Text
              className={styles.techName}
              ff={isMobileDevice() ? "text" : "monospace"}
              fz={isMobileDevice() ? 14 : "xs"}
            >
              {techData.name}
            </Text>
          </Group>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <TechCard techId={techId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
