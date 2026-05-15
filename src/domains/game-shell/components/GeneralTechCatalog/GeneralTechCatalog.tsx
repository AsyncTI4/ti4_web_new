import { Box, Image, Text } from "@mantine/core";
import cx from "clsx";
import { getTechData, getTechTier } from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { getColorAlias } from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";
import type { Tech } from "@/entities/data/types";
import styles from "./GeneralTechCatalog.module.css";

type TechColor = "blue" | "green" | "red" | "yellow" | "white";

type TechGroup = {
  label: string;
  color: TechColor;
  icon: string;
  aliases: string[];
};

const COLORED_TECH_GROUPS: TechGroup[] = [
  {
    label: "Propulsion",
    color: "blue",
    icon: "/blue.png",
    aliases: ["amd", "det", "gd", "fl", "lwd", "sr"],
  },
  {
    label: "Biotic",
    color: "green",
    icon: "/green.png",
    aliases: ["nm", "dxa", "hm", "pa", "bs", "x89"],
  },
  {
    label: "Warfare",
    color: "red",
    icon: "/red.png",
    aliases: ["ps", "aida", "md_base", "sar", "da", "asc"],
  },
  {
    label: "Cybernetic",
    color: "yellow",
    icon: "/yellow.png",
    aliases: ["st", "sdn", "gls", "pi", "td", "ie"],
  },
];

const UNIT_TECH_ALIASES = [
  "ff2",
  "inf2",
  "dd2",
  "cr2",
  "cv2",
  "pds2",
  "dn2",
  "sd2",
  "ws",
];

const REQUIREMENT_ICON_MAP: Record<string, string> = {
  B: "/blue.png",
  G: "/green.png",
  R: "/red.png",
  Y: "/yellow.png",
};

function byTierThenName(a: Tech, b: Tech) {
  return getTechTier(a.requirements) - getTechTier(b.requirements)
    || a.name.localeCompare(b.name);
}

function resolveTechs(aliases: string[]) {
  return aliases
    .map((alias) => getTechData(alias))
    .filter((tech): tech is Tech => Boolean(tech))
    .sort(byTierThenName);
}

function HeaderRequirementIcons({ requirements }: { requirements?: string }) {
  if (!requirements) return null;

  const icons = requirements
    .split("")
    .map((requirement) => REQUIREMENT_ICON_MAP[requirement])
    .filter((icon): icon is string => Boolean(icon));

  if (icons.length === 0) return null;

  return (
    <Box className={styles.headerRequirementIcons}>
      {icons.map((icon, index) => (
        <Image
          key={`${icon}-${index}`}
          src={icon}
          alt="tech prerequisite"
          className={styles.headerRequirementIcon}
        />
      ))}
    </Box>
  );
}

function getUnitUpgradeImageSrc(tech: Tech) {
  if (!tech.types.includes("UNITUPGRADE")) return undefined;

  const requiredTechId = tech.baseUpgrade || tech.alias;
  const unitData = getGenericUnitDataByRequiredTechId(requiredTechId);
  if (!unitData?.asyncId) return undefined;

  return cdnImage(`/units/${getColorAlias(undefined)}_${unitData.asyncId}.png`);
}

function TechItem({ tech, color }: { tech: Tech; color: TechColor }) {
  const unitImageSrc = getUnitUpgradeImageSrc(tech);

  return (
    <Box className={cx(styles.techItem, styles[color])}>
      <Box className={styles.techHeader}>
        <Box className={styles.techNameGroup}>
          {unitImageSrc && (
            <Image
              src={unitImageSrc}
              alt=""
              className={styles.unitUpgradeIcon}
            />
          )}
          <Text className={styles.techName}>{tech.name}</Text>
        </Box>
        <HeaderRequirementIcons requirements={tech.requirements} />
      </Box>
      <Text className={styles.techText}>
        {tech.text || "No description available."}
      </Text>
    </Box>
  );
}

function ColoredTechSection() {
  return (
    <Box className={styles.section}>
      <Text className={styles.sectionTitle}>Generic Technology</Text>
      <Box className={styles.colorGrid}>
        {COLORED_TECH_GROUPS.map((group) => (
          <Box key={group.label} className={styles.colorColumn}>
            <Box className={styles.colorHeading}>
              <Image src={group.icon} alt="" className={styles.colorIcon} />
              <span>{group.label}</span>
            </Box>
            <Box className={styles.techList}>
              {resolveTechs(group.aliases).map((tech) => (
                <TechItem key={tech.alias} tech={tech} color={group.color} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function UnitTechSection() {
  return (
    <Box className={styles.section}>
      <Text className={styles.sectionTitle}>Unit Upgrade Technology</Text>
      <Box className={styles.unitGrid}>
        {resolveTechs(UNIT_TECH_ALIASES).map((tech) => (
          <TechItem key={tech.alias} tech={tech} color="white" />
        ))}
      </Box>
    </Box>
  );
}

export function GeneralTechCatalog() {
  return (
    <Box className={styles.catalog}>
      <ColoredTechSection />
      <UnitTechSection />
    </Box>
  );
}
