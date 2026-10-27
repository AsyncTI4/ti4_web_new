import cx from "clsx";
import { Box, Image } from "@/ds";
import {
  getTechData,
  getTechTier,
  TECH_PREREQ_ICON,
  TECH_TYPE_COLOR,
} from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { getColorAlias } from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";
import { TECH_COLOR_IMAGES } from "@/entities/data/uiImages";
import type { PlayerData, Tech } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import styles from "./GeneralTechCatalog.module.css";

type GeneralTechCatalogProps = {
  technologyDeck?: string[];
  playerData: PlayerData[];
  className?: string;
};

type TechColor = "blue" | "green" | "red" | "yellow" | "unit";

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
    icon: TECH_COLOR_IMAGES.blue,
    aliases: ["amd", "det", "gd", "fl", "lwd", "sr"],
  },
  {
    label: "Biotic",
    color: "green",
    icon: TECH_COLOR_IMAGES.green,
    aliases: ["nm", "dxa", "hm", "pa", "bs", "x89c4"],
  },
  {
    label: "Warfare",
    color: "red",
    icon: TECH_COLOR_IMAGES.red,
    aliases: ["ps", "aida", "md", "sar", "da", "asc"],
  },
  {
    label: "Cybernetic",
    color: "yellow",
    icon: TECH_COLOR_IMAGES.yellow,
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
    const tech = getTechData(alias);
    return !tech?.faction && tech?.types?.includes("UNITUPGRADE");
  });

  return units.length > 0 ? units : DEFAULT_UNIT_TECH_ALIASES;
}

function getUnitUpgradeImageSrc(tech: Tech) {
  if (!tech.types.includes("UNITUPGRADE")) return undefined;

  const unitData = getGenericUnitDataByRequiredTechId(tech.baseUpgrade || tech.alias);
  if (!unitData?.asyncId) return undefined;

  return cdnImage(`/units/${getColorAlias(undefined)}_${unitData.asyncId}.png`);
}

type Seat = Pick<
  PlayerData,
  "faction" | "factionImage" | "factionImageType" | "techs" | "exhaustedTechs" | "userName"
>;

function ownership(seat: Seat, tech: Tech) {
  if (!seat.techs.includes(tech.alias)) return undefined;
  return seat.exhaustedTechs.includes(tech.alias) ? "exhausted" : "owned";
}

function PrereqIcons({ requirements }: { requirements?: string }) {
  const icons = (requirements ?? "")
    .split("")
    .map((requirement) => TECH_PREREQ_ICON[requirement])
    .filter((icon): icon is string => Boolean(icon));

  if (icons.length === 0) return null;

  return (
    <span className={styles.prereqs} aria-label={`Requires ${requirements}`}>
      {icons.map((icon, index) => (
        <Image key={`${icon}-${index}`} src={icon} alt="" className={styles.prereq} />
      ))}
    </span>
  );
}

/** Seats holding this tech, in seat order; exhausted copies are dimmed. */
function Owners({ tech, seats }: { tech: Tech; seats: Seat[] }) {
  const owners = seats
    .map((seat) => ({ seat, state: ownership(seat, tech) }))
    .filter((owner) => owner.state);

  if (owners.length === 0) return null;

  return (
    <span className={styles.owners}>
      {owners.map(({ seat, state }) => (
        <span
          key={seat.faction}
          className={styles.owner}
          data-s={state}
          title={`${seat.userName} (${seat.faction}): ${state}`}
        >
          <FactionIcon
            faction={seat.faction}
            factionImageOverride={seat.factionImage}
            factionImageTypeOverride={seat.factionImageType}
            alt={seat.faction}
            w={18}
            h={18}
          />
        </span>
      ))}
    </span>
  );
}

function TechItem({
  tech,
  color,
  seats,
}: {
  tech: Tech;
  color: TechColor;
  seats: Seat[];
}) {
  const unitImageSrc = getUnitUpgradeImageSrc(tech);

  return (
    <Box className={styles.tech} data-k={color}>
      <Box className={styles.head}>
        {unitImageSrc && <Image src={unitImageSrc} alt="" className={styles.unit} />}
        <span className={styles.name}>{tech.name}</span>
        <PrereqIcons requirements={tech.requirements} />
      </Box>
      <Owners tech={tech} seats={seats} />
      <p className={styles.text}>{tech.text || "No description available."}</p>
    </Box>
  );
}

function TechColumn({ group, seats }: { group: TechGroup; seats: Seat[] }) {
  const techs = resolveTechs(group.aliases);
  if (techs.length === 0) return null;

  return (
    <Box className={styles.column} data-k={group.color}>
      <span className={styles.groupLabel}>
        <Image src={group.icon} alt="" className={styles.groupIcon} />
        {group.label}
      </span>
      {techs.map((tech) => (
        <TechItem key={tech.alias} tech={tech} color={group.color} seats={seats} />
      ))}
    </Box>
  );
}

/**
 * Generic technology listed in full: every tech with its text, grouped by
 * colour, then the unit upgrades. Owners sit on each tech as faction icons in
 * seat order; exhausted copies are dimmed.
 */
export function GeneralTechCatalog({
  technologyDeck = [],
  playerData,
  className,
}: GeneralTechCatalogProps) {
  const seats = getSeatOrder(playerData);
  const groups = getColoredTechGroups(technologyDeck);
  const unitTechs = resolveTechs(getUnitTechAliases(technologyDeck));

  return (
    <Box className={cx(styles.box, className)}>
      <RailLabel
        meta={<span className={styles.hint}>owners shown on each tech · dimmed = exhausted</span>}
      >
        Generic technology
      </RailLabel>
      <Box className={styles.grid}>
        {groups.map((group) => (
          <TechColumn key={group.label} group={group} seats={seats} />
        ))}
      </Box>

      {unitTechs.length > 0 && (
        <>
          <RailLabel>Unit upgrades</RailLabel>
          <Box className={styles.grid}>
            {unitTechs.map((tech) => (
              <TechItem key={tech.alias} tech={tech} color="unit" seats={seats} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
