import { Box, Group, Text } from "@mantine/core";
import styles from "./Tech.module.css";
import { getFactionImage } from "@/entities/lookup/factions";
import { TechCard } from "./TechCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
  getTechData,
  getTechLetter,
  getTechSynergyPair,
  getTechTier,
  TECH_TYPE_COLOR,
  type TechColor,
} from "@/entities/lookup/tech";
import cx from "clsx";
import type { CSSProperties } from "react";

type Props = {
  techId: string;
  isExhausted?: boolean;
  synergy?: string[];
  breakthroughUnlocked?: boolean;
};

export function Tech({
  techId,
  isExhausted = false,
  synergy,
  breakthroughUnlocked = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const techData = getTechData(techId);

  if (!techData) return null;

  const color = getTechColor(techData.types[0]);
  const tier = getTechTier(techData.requirements);
  const isFactionTech = !!techData.faction;
  const synergyClass = breakthroughUnlocked
    ? getSynergyClass(synergy, color)
    : "";
  const techLetter = getTechLetter(techData.name);
  const techIconSrc = techData.faction
    ? getFactionImage(techData.faction)
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
            isExhausted && styles.exhausted,
            synergyClass && styles[synergyClass],
          )}
          onClick={toggle}
        >
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
              ff="text"
              fz="xs"
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

const getTechColor = (techType: string): string =>
  TECH_TYPE_COLOR[techType] ?? (techType === "NONE" ? "white" : "gray");

function getSynergyClass(
  synergy: string[] | undefined,
  techColor: string,
): string {
  if (!synergy) return "";
  const colors = synergy
    .map((s) => TECH_TYPE_COLOR[s])
    .filter((c): c is TechColor => Boolean(c));

  if (!colors.includes(techColor as TechColor)) return "";

  const pair = getTechSynergyPair(colors);
  if (!pair) return "";
  return `synergy${pair[0].toUpperCase()}${pair.slice(1)}`;
}
