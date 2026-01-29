import { Box, Group, Text, Image } from "@mantine/core";
import styles from "./Tech.module.css";
import { cdnImage } from "../../../data/cdnImage";
import { TechCard } from "./TechCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import { getTechData } from "../../../lookup/tech";
import { isMobileDevice } from "@/utils/isTouchDevice";
import cx from "clsx";

type Props = {
  techId: string;
  isExhausted?: boolean;
  mobile?: boolean;
  synergy?: string[];
  breakthroughUnlocked?: boolean;
};

export function Tech({
  techId,
  isExhausted = false,
  mobile = false,
  synergy,
  breakthroughUnlocked = false,
}: Props) {
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
  const isEnhanced = false;
  const synergyClass = breakthroughUnlocked
    ? getSynergyClass(synergy, color)
    : "";

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box
          className={cx(
            styles.techCard,
            styles[color],
            isFactionTech && styles.factionTech,
            isEnhanced && styles.enhanced,
            synergyClass && styles[synergyClass]
          )}
          onClick={() => setOpened((o) => !o)}
          style={{ opacity: isExhausted ? 0.5 : 1 }}
        >
          {/* Tier indicator dots in top-right */}
          {tier > 0 && (
            <Box className={styles.tierContainer}>
              {[...Array(tier).keys()].map((dotIndex) => (
                <Box
                  key={dotIndex}
                  className={cx(styles.tierDot, styles[color])}
                />
              ))}
            </Box>
          )}
          <Group className={styles.contentGroup}>
            {isFactionTech ? (
              <Box
                className={cx(
                  styles.techIcon,
                  styles.factionTechIcon,
                  styles[color]
                )}
              >
                <Image
                  src={cdnImage(`/factions/${techData.faction}.png`)}
                  alt={`${techData.faction} faction`}
                />
              </Box>
            ) : techData.name === "Antimatter" ? (
              <Box
                className={cx(
                  styles.techIcon,
                  styles.techLetter,
                  styles[color]
                )}
              >
                <Text fw={700} fz={14} c="white">
                  A
                </Text>
              </Box>
            ) : techData.name === "Wavelength" ? (
              <Box
                className={cx(
                  styles.techIcon,
                  styles.techLetter,
                  styles[color]
                )}
              >
                <Text fw={700} fz={14} c="white">
                  W
                </Text>
              </Box>
            ) : (
              <Image
                src={
                  isFactionTech
                    ? cdnImage(`/factions/${techData.faction}.png`)
                    : color === "white"
                      ? undefined
                      : `/${color}.png`
                }
                alt={techData.name}
                className={cx(styles.techIcon, styles[color])}
              />
            )}
            <Text
              className={styles.techName}
              ff={mobile ? "text" : "monospace"}
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
    case "NONE":
    case "GENERICTF":
      return "white";
    default:
      return "gray";
  }
};

function getSynergyClass(
  synergy: string[] | undefined,
  techColor: string
): string {
  if (!synergy || synergy.length === 0) return "";
  const colors = synergy
    .map((s) => getTechColor(s))
    .filter((c): c is string => Boolean(c));

  if (colors.length < 2) return "";

  // Only apply synergy if the tech color matches one of the synergy colors
  if (!colors.includes(techColor)) return "";

  // Sort colors alphabetically and capitalize first letter of each
  const [a, b] = [...colors].sort();
  const colorA = a.charAt(0).toUpperCase() + a.slice(1);
  const colorB = b.charAt(0).toUpperCase() + b.slice(1);

  return `synergy${colorA}${colorB}`;
}

const getTechTier = (requirements?: string): number => {
  if (!requirements) return 0;
  const matches = requirements.match(/(.)\1*/g);
  if (matches && matches.length > 0) {
    return matches[0].length;
  }
  return 0;
};
