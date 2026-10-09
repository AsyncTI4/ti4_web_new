import { Box, Text, Tooltip } from "@mantine/core";
import { IconSwords } from "@tabler/icons-react";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { UnitDetailsCard } from "@/domains/cards/components/UnitDetailsCard";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cdnImage } from "@/entities/data/cdnImage";
import type { Unit } from "@/entities/data/types";
import { formatStat, type ForceSummary, type UnitRow } from "./fleetMath";
import type { FactionHelpers } from "./useFactionHelpers";
import { useUnitSheet } from "./unitSheet";
import styles from "./SystemDossier.module.css";

/**
 * Structures ride in the same rack as combat units; their working stat —
 * production for docks, space cannon for PDS — rides on the badge, spelled
 * out so it needs no decoder ring.
 */
function unitBadgeSuffix(unit: Unit): string | null {
  if (unit.productionValue) return `production ${unit.productionValue}`;
  if (!unit.spaceCannonHitsOn) return null;
  const dice = unit.spaceCannonDieCount ?? 1;
  return `space cannon ${unit.spaceCannonHitsOn}${dice > 1 ? `×${dice}` : ""}`;
}

function unitStatLine(unit: Unit, sustained: number): string {
  const combatDice = unit.combatDieCount ?? 1;
  return [
    unit.cost != null ? `Cost ${formatStat(unit.cost)}` : null,
    unit.combatHitsOn
      ? `Combat ${unit.combatHitsOn}${combatDice > 1 ? ` ×${unit.combatDieCount}` : ""}`
      : null,
    unit.moveValue ? `Move ${unit.moveValue}` : null,
    unit.capacityValue ? `Capacity ${unit.capacityValue}` : null,
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
  const suffix = unitBadgeSuffix(unit);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
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
            className={styles.unitChip}
            aria-expanded={opened}
            onClick={
              openUnitSheet
                ? () => openUnitSheet({ unitId: unit.id, color })
                : toggle
            }
          >
            <img
              src={cdnImage(`/units/${colorAlias}_${unit.asyncId}.png`)}
              alt=""
              className={styles.unitChipImage}
            />
            {count > 1 && (
              <span className={styles.unitChipCount}>{count}×</span>
            )}
            <span className={styles.unitChipName}>{unit.name}</span>
            {suffix && <span className={styles.unitChipSuffix}>{suffix}</span>}
          </button>
        </Tooltip>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.unitPopover}>
        <UnitDetailsCard unitId={unit.id} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

const FORCE_MATH_STATS = [
  {
    key: "cost",
    title: "Total build cost",
    icon: "/player_area/pa_resources.png",
    alt: "Cost",
  },
  {
    key: "hitPoints",
    title: "Hits the force can absorb",
    icon: "/player_area/pa_health.png",
    alt: "Hits absorbed",
  },
  {
    key: "expectedHits",
    title: "Expected hits per combat round",
    icon: "/player_area/pa_hit.png",
    alt: "Expected hits",
  },
] as const satisfies {
  key: keyof ForceSummary;
  title: string;
  icon: string;
  alt: string;
}[];

export type ZoneSummary = {
  faction: string;
  rows: UnitRow[];
  math: ForceSummary;
};

/**
 * One faction's presence in a zone: a single large faction icon owns the
 * strip, its units flow beside it as named badges, and the three numbers a
 * player weighs a force by sit in a fixed-width readout trough so numerals
 * align across strips. The math counts only units that roll dice in this
 * zone's combat. A battle calculator link, when given, closes the row.
 */
export function ForceStrip({
  summary: { faction, rows, math },
  helpers,
  battleCalcUrl,
}: {
  summary: ZoneSummary;
  helpers: FactionHelpers;
  battleCalcUrl?: string | null;
}) {
  const colorAlias = helpers.colorAlias(faction);
  const color = helpers.playerFor(faction)?.color;

  return (
    <div className={styles.forceStrip}>
      <span className={styles.forceOwner} title={helpers.displayName(faction)}>
        <FactionIcon faction={faction} w={26} h={26} />
      </span>
      <div className={styles.forceUnits}>
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
      </div>
      <div className={styles.forceTrail}>
        <div className={styles.forceMath}>
          {FORCE_MATH_STATS.map((stat) => (
            <span key={stat.key} title={stat.title}>
              <img src={cdnImage(stat.icon)} alt={stat.alt} />
              {formatStat(math[stat.key])}
            </span>
          ))}
        </div>
        {battleCalcUrl && (
          <a
            className={styles.battleLink}
            href={battleCalcUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ti4battle.com with ${helpers.displayName(faction)} set as the defender`}
          >
            <IconSwords size={13} aria-hidden />
            Battle calc
          </a>
        )}
      </div>
    </div>
  );
}

/** Ownership reads as one badge: role, faction mark and faction name. */
export function ControllerChip({
  faction,
  displayName,
  label = "Control",
}: {
  faction: string | null | undefined;
  displayName: (faction: string) => string;
  label?: string;
}) {
  return (
    <span className={styles.control}>
      {faction ? (
        <span
          className={styles.controller}
          aria-label={`${label}: ${displayName(faction)}`}
        >
          <span className={styles.controlLabel}>{label}</span>
          <FactionIcon faction={faction} w={14} h={14} />
          {displayName(faction)}
        </span>
      ) : (
        <span className={styles.uncontrolled}>
          <span className={styles.controlLabel}>{label}</span>
          Uncontrolled
        </span>
      )}
    </span>
  );
}
