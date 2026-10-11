import { Fragment, useState } from "react";
import { Box, Image, UnstyledButton } from "@/ds";
import {
  getTechData,
  getTechTier,
  TECH_TYPE_COLOR,
} from "@/entities/lookup/tech";
import type { PlayerData, Tech } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import styles from "./GeneralTechCatalog.module.css";

type GeneralTechCatalogProps = {
  technologyDeck?: string[];
  playerData: PlayerData[];
};

type TechColor = "blue" | "green" | "red" | "yellow";

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

type Seat = Pick<
  PlayerData,
  "faction" | "factionImage" | "factionImageType" | "techs" | "exhaustedTechs" | "userName"
>;

function ownership(seat: Seat, tech: Tech) {
  if (!seat.techs.includes(tech.alias)) return undefined;
  return seat.exhaustedTechs.includes(tech.alias) ? "exhausted" : "owned";
}

function TierPips({ tier }: { tier: number }) {
  if (tier <= 0) return null;
  return (
    <span className={styles.pips} aria-label={`Tier ${tier}`}>
      {Array.from({ length: tier }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

function TechRow({
  tech,
  color,
  seats,
  expanded,
  onToggle,
}: {
  tech: Tech;
  color: TechColor;
  seats: Seat[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const owners = seats.filter((seat) => ownership(seat, tech)).length;

  return (
    <Box className={styles.row} data-k={color} data-open={expanded || undefined}>
      <UnstyledButton
        className={styles.module}
        onClick={onToggle}
        aria-expanded={expanded}
        title={expanded ? "Hide text" : "Show text"}
      >
        <span className={styles.name}>{tech.name}</span>
        <TierPips tier={getTechTier(tech.requirements)} />
      </UnstyledButton>
      {seats.map((seat) => {
        const state = ownership(seat, tech);
        return (
          <span
            key={seat.faction}
            className={styles.cell}
            title={state ? `${seat.faction}: ${state}` : undefined}
          >
            {state && <i className={styles.own} data-s={state} />}
          </span>
        );
      })}
      <span className={styles.count}>{owners || ""}</span>
      {expanded && (
        <p className={styles.text}>{tech.text || "No description available."}</p>
      )}
    </Box>
  );
}

function GroupRows({
  group,
  seats,
  openTech,
  onToggle,
}: {
  group: TechGroup;
  seats: Seat[];
  openTech: string | null;
  onToggle: (alias: string) => void;
}) {
  const techs = resolveTechs(group.aliases);
  if (techs.length === 0) return null;

  return (
    <>
      <Box className={styles.groupRow} data-k={group.color}>
        <span className={styles.groupLabel}>
          <Image src={group.icon} alt="" className={styles.groupIcon} />
          {group.label}
        </span>
      </Box>
      {techs.map((tech) => (
        <TechRow
          key={tech.alias}
          tech={tech}
          color={group.color}
          seats={seats}
          expanded={openTech === tech.alias}
          onToggle={() => onToggle(tech.alias)}
        />
      ))}
    </>
  );
}

/**
 * Generic technology as a tech × seat ownership matrix. Every tech is a row,
 * every seat a column in seat order; owned is a filled square in the tech's
 * colour, exhausted an outline. Click a tech to read its text.
 */
export function GeneralTechCatalog({
  technologyDeck = [],
  playerData,
}: GeneralTechCatalogProps) {
  const [openTech, setOpenTech] = useState<string | null>(null);
  const seats = getSeatOrder(playerData);
  const groups = getColoredTechGroups(technologyDeck);
  const toggle = (alias: string) =>
    setOpenTech((current) => (current === alias ? null : alias));

  return (
    <Box className={styles.box}>
      <RailLabel
        meta={
          <>
            <span className={styles.legend}>
              <i className={styles.own} data-s="owned" /> owned
            </span>
            <span className={styles.legend}>
              <i className={styles.own} data-s="exhausted" /> exhausted
            </span>
            <span className={styles.hint}>click a tech to read it</span>
          </>
        }
      >
        Technology · who owns what
      </RailLabel>
      <Box className={styles.scroller}>
        <Box
          className={styles.matrix}
          style={{ "--seats": seats.length } as React.CSSProperties}
          role="table"
          aria-label="Generic technology ownership by seat"
        >
          <Box className={styles.headRow}>
            <span />
            {seats.map((seat) => (
              <span key={seat.faction} className={styles.seatHead} title={seat.userName}>
                <FactionIcon
                  faction={seat.faction}
                  factionImageOverride={seat.factionImage}
                  factionImageTypeOverride={seat.factionImageType}
                  alt={seat.faction}
                  w={20}
                  h={20}
                />
              </span>
            ))}
            <span className={styles.countHead}>Σ</span>
          </Box>
          {groups.map((group) => (
            <Fragment key={group.label}>
              <GroupRows
                group={group}
                seats={seats}
                openTech={openTech}
                onToggle={toggle}
              />
            </Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
