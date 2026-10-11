import type { CSSProperties } from "react";
import { Box, Text, Tooltip } from "@/ds";
import { IconCalculator, IconTarget } from "@tabler/icons-react";
import cx from "clsx";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { UnitDetailsCard } from "@/domains/cards/components/UnitDetailsCard";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cdnImage } from "@/entities/data/cdnImage";
import { getColorAlias } from "@/entities/lookup/colors";
import type { Unit } from "@/entities/data/types";
import type { TilePdsEntry } from "@/entities/game/types";
import {
  formatStat,
  type Capacity,
  type ForceSummary,
  type UnitRow,
} from "./fleetMath";
import { colorTriplet, type FactionHelpers } from "./useFactionHelpers";
import { useUnitSheet } from "./unitSheet";
import styles from "./SystemDossier.module.css";

export type ZoneSummary = {
  faction: string;
  rows: UnitRow[];
  math: ForceSummary;
};

export type Role =
  | "attacking"
  | "defending"
  | "landing"
  | "controls"
  | undefined;

/** The two sides of a zone's fight, when there are exactly two. */
export type Sides = { attacker: ZoneSummary; defender: ZoneSummary } | null;

function unitStatLine(unit: Unit, sustained: number): string {
  const combatDice = unit.combatDieCount ?? 1;
  return [
    unit.cost != null ? `Cost ${formatStat(unit.cost)}` : null,
    unit.combatHitsOn
      ? `Combat ${unit.combatHitsOn}${combatDice > 1 ? ` ×${unit.combatDieCount}` : ""}`
      : null,
    unit.moveValue ? `Move ${unit.moveValue}` : null,
    unit.capacityValue ? `Capacity ${unit.capacityValue}` : null,
    unit.productionValue ? `Production ${unit.productionValue}` : null,
    unit.spaceCannonHitsOn
      ? `Space cannon ${unit.spaceCannonHitsOn}${(unit.spaceCannonDieCount ?? 1) > 1 ? ` ×${unit.spaceCannonDieCount}` : ""}`
      : null,
    unit.sustainDamage ? "Sustain Damage" : null,
    sustained > 0 ? `${sustained} damage sustained` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Hover gives the one-line readout; a click opens the full stat card, the
 * same one the board shows for the unit.
 */
function UnitChip({
  unit,
  color,
  colorAlias,
  count,
  sustained,
}: {
  unit: Unit;
  color: string | undefined;
  colorAlias: string;
  count: number;
  sustained: number;
}) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const openUnitSheet = useUnitSheet();

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        {/* A DOM node for the popover to anchor to; the tooltip takes no ref. */}
        <span className={styles.unitAnchorBox}>
          <Tooltip
            multiline
            maw={300}
            disabled={opened || !!openUnitSheet}
            label={
              <Box>
                <Text size="xs" fw={600}>
                  {unit.name}
                </Text>
                <Text size="xs" ff="monospace">
                  {unitStatLine(unit, sustained)}
                </Text>
                {unit.ability && (
                  <Text size="xs" mt={4} c="gray.4">
                    {unit.ability}
                  </Text>
                )}
              </Box>
            }
          >
            <button
              type="button"
              className={cx(styles.unit, unit.isStructure && styles.unitStruct)}
              aria-expanded={opened}
              aria-label={`${count} ${unit.name}`}
              onClick={
                openUnitSheet
                  ? () => openUnitSheet({ unitId: unit.id, color })
                  : toggle
              }
            >
              <img
                src={cdnImage(`/units/${colorAlias}_${unit.asyncId}.png`)}
                alt=""
              />
              {count}
              {sustained > 0 && <i className={styles.unitDamage} aria-hidden />}
            </button>
          </Tooltip>
        </span>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.unitPopover}>
        <UnitDetailsCard unitId={unit.id} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

/**
 * One faction's presence in a zone, on the dossier's shared columns: who and
 * in what role, their units, then expected hits, hit points and capacity so
 * the numbers line up from band to band.
 */
export function ForceRow({
  summary: { faction, rows, math },
  helpers,
  role,
  capacity,
}: {
  summary: ZoneSummary;
  helpers: FactionHelpers;
  role?: Role;
  capacity?: Capacity | null;
}) {
  const colorAlias = helpers.colorAlias(faction);
  const color = helpers.playerFor(faction)?.color;
  const name = helpers.displayName(faction);

  return (
    <div
      className={styles.force}
      data-side={role === "attacking" || role === "landing" ? "att" : undefined}
      style={{ "--pc": helpers.rgb(faction) } as CSSProperties}
    >
      <span className={styles.who} title={name}>
        <FactionIcon faction={faction} w={20} h={20} />
        <span className={styles.whoName}>{name}</span>
        {role && <em>{role}</em>}
      </span>
      <span className={styles.units}>
        {rows.map((row) => (
          <UnitChip
            key={row.asyncId}
            unit={row.unit}
            color={color}
            colorAlias={colorAlias}
            count={row.count}
            sustained={row.sustained}
          />
        ))}
      </span>
      <b className={styles.n} title="Expected hits per combat round">
        {math.expectedHits > 0 ? formatStat(math.expectedHits) : "–"}
      </b>
      <b className={styles.n} title="Hits the force can absorb">
        {math.hitPoints > 0 ? formatStat(math.hitPoints) : "–"}
      </b>
      <b className={styles.n} title="Capacity used of total">
        {capacity ? (
          <>
            {capacity.used}
            <i>/{capacity.total}</i>
          </>
        ) : null}
      </b>
    </div>
  );
}

/** Space cannon in range of the system: it fires before the first round. */
export function FireRow({
  entry,
  helpers,
}: {
  entry: TilePdsEntry;
  helpers: FactionHelpers;
}) {
  const name = helpers.displayName(entry.faction);
  return (
    <div
      className={styles.fire}
      style={{ "--pc": colorTriplet(entry.color) } as CSSProperties}
      aria-label={`${name}: ${entry.count} PDS in range, ${formatStat(entry.expected)} expected hits`}
    >
      <span className={styles.who}>
        <IconTarget size={16} aria-hidden />
        <span className={styles.whoName}>Space cannon</span>
      </span>
      <span className={styles.units}>
        <span className={cx(styles.unit, styles.unitStatic)}>
          <img
            src={cdnImage(`/units/${getColorAlias(entry.color)}_pd.png`)}
            alt=""
          />
          {entry.count}
        </span>
        <span className={styles.from}>
          <FactionIcon faction={entry.faction} w={13} h={13} />
          {name} · in range, fires before combat
        </span>
      </span>
      <b className={styles.n} title="Expected space cannon hits">
        {formatStat(entry.expected)}
      </b>
      <b className={styles.n} />
      <b className={styles.n} />
    </div>
  );
}

/**
 * Attacker's colour against the defender's, split by each side's share of
 * the expected hits per round. A share of hits, not a win probability.
 */
export function Balance({
  sides,
  helpers,
}: {
  sides: Sides;
  helpers: FactionHelpers;
}) {
  if (!sides) return null;
  const a = sides.attacker.math.expectedHits;
  const d = sides.defender.math.expectedHits;
  if (a + d <= 0) return null;

  const share = Math.round((a / (a + d)) * 100);
  const leader = a === d ? null : a > d ? sides.attacker : sides.defender;
  const odds = leader
    ? `${helpers.displayName(leader.faction)} ahead · ${Math.max(share, 100 - share)}% of hits`
    : "Even · 50% of hits";

  return (
    <>
      <span
        className={styles.balance}
        style={
          {
            "--a": helpers.rgb(sides.attacker.faction),
            "--d": helpers.rgb(sides.defender.faction),
            "--ap": `${share}%`,
          } as CSSProperties
        }
        role="img"
        aria-label={`Expected hits: ${helpers.displayName(sides.attacker.faction)} ${formatStat(a)}, ${helpers.displayName(sides.defender.faction)} ${formatStat(d)}`}
      >
        <i />
        <b className={styles.balanceL}>{formatStat(a)}</b>
        <b className={styles.balanceR}>{formatStat(d)}</b>
      </span>
      <span className={styles.odds}>{odds}</span>
    </>
  );
}

/**
 * Orders a zone's forces attacker first, then defender, then anyone else,
 * and names each one's role. Only `fighting` factions can be sides.
 */
export function arrangeZone(
  summaries: ZoneSummary[],
  fighting: (summary: ZoneSummary) => boolean,
  attacker: string | null,
  controller: string | null | undefined,
  ground: boolean,
): { ordered: ZoneSummary[]; sides: Sides; roleOf: (faction: string) => Role } {
  const contenders = summaries.filter(fighting);
  const controlRole: Role = ground ? "controls" : undefined;
  const plainRole = (faction: string): Role =>
    faction === controller ? controlRole : undefined;

  if (contenders.length !== 2) {
    return { ordered: summaries, sides: null, roleOf: plainRole };
  }

  const att =
    contenders.find((s) => s.faction === attacker) ??
    contenders.find((s) => s.faction !== controller) ??
    contenders[1];
  const def = contenders.find((s) => s !== att)!;
  const rest = summaries.filter((s) => s !== att && s !== def);
  const roleOf = (faction: string): Role => {
    if (faction === att.faction) return ground ? "landing" : "attacking";
    if (faction === def.faction) {
      return ground && faction === controller ? "controls" : "defending";
    }
    return plainRole(faction);
  };

  return {
    ordered: [att, def, ...rest],
    sides: { attacker: att, defender: def },
    roleOf,
  };
}

/** Ownership reads as one pill: role, faction mark and faction name. */
export function ControlPill({
  faction,
  displayName,
  label = "Holds",
}: {
  faction: string | null | undefined;
  displayName: (faction: string) => string;
  label?: string;
}) {
  if (!faction) {
    return (
      <span className={styles.pill}>
        <span className={styles.pillLabel}>Uncontrolled</span>
      </span>
    );
  }
  return (
    <span
      className={styles.pill}
      aria-label={`${label}: ${displayName(faction)}`}
    >
      <span className={styles.pillLabel}>{label}</span>
      <FactionIcon faction={faction} w={14} h={14} />
      <b>{displayName(faction)}</b>
    </span>
  );
}

/** A band's own battle in the calculator, as a quiet icon link. */
export function CalcLink({
  url,
  title,
}: {
  url: string | null | undefined;
  title: string;
}) {
  if (!url) return null;
  return (
    <Tooltip label={title} multiline maw={260}>
      <a
        className={styles.calcLink}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
      >
        <IconCalculator size={14} aria-hidden />
      </a>
    </Tooltip>
  );
}
