import { Box, Group, Text } from "@mantine/core";
import styles from "./Tech.module.css";
import { cdnImage } from "@/entities/data/cdnImage";
import { TechCard } from "./TechCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useState } from "react";
import { getTechData } from "@/entities/lookup/tech";
import { isMobileDevice } from "@/utils/isTouchDevice";
import cx from "clsx";
import type { CSSProperties } from "react";

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
  const techLetter = getTechLetter(techData.name);
  const techIconSrc = isFactionTech
    ? cdnImage(`/factions/${techData.faction}.png`)
    : color === "white" || techLetter
      ? undefined
      : `/${color}.png`;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box
          className={cx(
            styles.techCard,
            styles[color],
            isFactionTech && styles.factionTech,
            isEnhanced && styles.enhanced,
            isExhausted && styles.exhausted,
            synergyClass && styles[synergyClass],
          )}
          onClick={() => setOpened((o) => !o)}
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
          <Group
            className={cx(
              styles.contentGroup,
              (techIconSrc || techLetter) && styles.contentGroupWithIcon,
              techLetter && styles.techLetter,
              isFactionTech && styles.factionTechIcon,
              styles[color],
            )}
            style={
              techIconSrc
                ? getTechIconStyle(techIconSrc, isFactionTech ? "18px" : "14px")
                : undefined
            }
            data-tech-letter={techLetter}
          >
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

function getTechIconStyle(src: string, size = "14px"): CSSProperties {
  return {
    "--tech-icon-image": `url("${src}")`,
    "--tech-icon-bg-size": size,
  } as CSSProperties;
}

function getTechLetter(techName: string): string | undefined {
  if (techName === "Antimatter") return "A";
  if (techName === "Wavelength") return "W";
  return undefined;
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
      return "white";
    default:
      return "gray";
  }
};

function getSynergyClass(
  synergy: string[] | undefined,
  techColor: string,
): string {
  if (!synergy || synergy.length === 0) return "";
  const colors = synergy
    .map((s) => getTechColor(s))
    .filter((c): c is string => Boolean(c));

  if (colors.length < 2) return "";

  // Only apply synergy if the tech color matches one of the synergy colors
  if (!colors.includes(techColor)) return "";

  const pairKey = [...colors].sort().join("-");
  const synergyClassMap: Record<string, string> = {
    "blue-green": "synergyBlueGreen",
    "blue-red": "synergyBlueRed",
    "blue-yellow": "synergyBlueYellow",
    "green-red": "synergyGreenRed",
    "green-yellow": "synergyGreenYellow",
    "red-yellow": "synergyYellowRed",
  };

  return synergyClassMap[pairKey] ?? "";
}

const getTechTier = (requirements?: string): number => {
  if (!requirements) return 0;
  const matches = requirements.match(/(.)\1*/g);
  if (matches && matches.length > 0) {
    return matches[0].length;
  }
  return 0;
};
