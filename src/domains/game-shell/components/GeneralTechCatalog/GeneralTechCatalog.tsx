import { Box, Image, Text } from "@mantine/core";
import cx from "clsx";
import {
  getTechData,
  getTechTier,
  TECH_PREREQ_ICON,
  TECH_TYPE_COLOR,
} from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { getColorAlias } from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";
import type { Tech } from "@/entities/data/types";
import styles from "./GeneralTechCatalog.module.css";

type GeneralTechCatalogProps = {
  technologyDeck?: string[];
};

type TechColor = "blue" | "green" | "red" | "yellow" | "white";

type TechGroup = {
  label: string;
  color: TechColor;
  icon: string;
  aliases: string[];
};

const DEFAULT_COLORED_TECH_GROUPS: TechGroup[] = [
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
    aliases: ["nm", "dxa", "hm", "pa", "bs", "x89c4"],
  },
  {
    label: "Warfare",
    color: "red",
    icon: "/red.png",
    aliases: ["ps", "aida", "md", "sar", "da", "asc"],
  },
  {
    label: "Cybernetic",
    color: "yellow",
    icon: "/yellow.png",
    aliases: ["st", "sdn", "gls", "pi", "td", "ie"],
  },
];

const DEFAULT_UNIT_TECH_ALIASES = [
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

function byTierThenName(a: Tech, b: Tech) {
  return (
    getTechTier(a.requirements) - getTechTier(b.requirements) ||
    a.name.localeCompare(b.name)
  );
}

function resolveTechs(aliases: string[]) {
  return aliases
    .map((alias) => getTechData(alias))
    .filter((tech): tech is Tech => Boolean(tech))
    .sort(byTierThenName);
}

function HeaderRequirementIcons({
  requirements,
}: {
  requirements?: string;
}) {
  if (!requirements) return null;

  const icons = requirements
    .split("")
    .map((requirement) => TECH_PREREQ_ICON[requirement])
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

function TechItem({
  tech,
  color,
}: {
  tech: Tech;
  color: TechColor;
}) {
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

function getTechColor(tech: Tech): string {
  return (
    tech.types
      .map((type) => (type === "UNITUPGRADE" ? "unit" : TECH_TYPE_COLOR[type]))
      .find(Boolean) ?? "other"
  );
}

function getColoredTechGroups(technologyDeck: string[]): TechGroup[] {
  const grouped = new Map<string, string[]>(
    DEFAULT_COLORED_TECH_GROUPS.map((group) => [group.color, []])
  );

  for (const alias of technologyDeck) {
    const tech = getTechData(alias);
    if (!tech || tech.faction) continue;
    grouped.get(getTechColor(tech))?.push(alias);
  }

  const hasDeckTechs = [...grouped.values()].some((aliases) => aliases.length > 0);
  if (!hasDeckTechs) return DEFAULT_COLORED_TECH_GROUPS;

  return DEFAULT_COLORED_TECH_GROUPS.map((group) => ({
    ...group,
    aliases: grouped.get(group.color) ?? [],
  }));
}

function getUnitTechAliases(technologyDeck: string[]): string[] {
  const units = technologyDeck.filter((alias) => {
    const techData = getTechData(alias);

    return (
      !techData?.faction &&
      techData?.types?.includes("UNITUPGRADE")
    );
  });

  return units.length > 0 ? units : DEFAULT_UNIT_TECH_ALIASES;
}

function ColoredTechSection({
  groups,
}: {
  groups: TechGroup[];
}) {
  return (
    <Box className={styles.section}>
      <Text className={styles.sectionTitle}>Generic Technology</Text>

      <Box className={styles.colorGrid}>
        {groups.map((group) => (
          <Box key={group.label} className={styles.colorColumn}>
            <Box className={styles.colorHeading}>
              <Image
                src={group.icon}
                alt=""
                className={styles.colorIcon}
              />

              <span>{group.label}</span>
            </Box>

            <Box className={styles.techList}>
              {resolveTechs(group.aliases).map((tech) => (
                <TechItem
                  key={tech.alias}
                  tech={tech}
                  color={group.color}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function UnitTechSection({
  aliases,
}: {
  aliases: string[];
}) {
  return (
    <Box className={styles.section}>
      <Text className={styles.sectionTitle}>Unit Upgrade Technology</Text>

      <Box className={styles.unitGrid}>
        {resolveTechs(aliases).map((tech) => (
          <TechItem
            key={tech.alias}
            tech={tech}
            color="white"
          />
        ))}
      </Box>
    </Box>
  );
}

export function GeneralTechCatalog({
  technologyDeck = [],
}: GeneralTechCatalogProps) {
  return (
    <Box className={styles.catalog}>
      <ColoredTechSection groups={getColoredTechGroups(technologyDeck)} />
      <UnitTechSection aliases={getUnitTechAliases(technologyDeck)} />
    </Box>
  );
}
