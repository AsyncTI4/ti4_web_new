import { promissoryNotes } from "@/entities/data/promissoryNotes";
import { agendas } from "@/entities/data/agendas";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { planets } from "@/entities/data/planets";
import { systems } from "@/entities/data/systems";
import { units } from "@/entities/data/units";
import { getAbility } from "@/entities/lookup/abilities";
import { getActionCard } from "@/entities/lookup/actionCards";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import { getLeaderById } from "@/entities/lookup/leaders";
import { getRelicData } from "@/entities/lookup/relics";
import { getSecretObjectiveData } from "@/entities/lookup/secretObjectives";
import { getTechData } from "@/entities/lookup/tech";

/** Turns a raw id into a readable label; the fallback for every name resolver. */
export function prettifyId(id: string): string {
  return id
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) =>
      w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1),
    )
    .join(" ");
}

type Named = { name?: string };

function indexBy<T extends Named>(
  rows: T[],
  key: (row: T) => string,
): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    const id = key(row);
    if (id && !map.has(id)) map.set(id, row);
  }
  return map;
}

/* The promissory lookup in entities/lookup drops homebrew notes, which event
   ids can still reference, so these three keep their own index. */
const promissoryById = indexBy(promissoryNotes, (r) => r.alias);
const agendasById = indexBy(agendas, (r) => r.alias);
const publicObjById = indexBy(publicObjectives, (r) => r.alias);

const CARD_LOOKUPS: Record<string, (id: string) => Named | undefined> = {
  CARD_PLAY_ACTION_CARD: getActionCard,
  CARD_PLAY_PROMISSORY_NOTE: (id) => promissoryById.get(id),
  CARD_PLAY_RELIC: getRelicData,
  CARD_PLAY_TECH_EXHAUST: getTechData,
  CARD_PLAY_BREAKTHROUGH: getBreakthroughData,
  CARD_PLAY_AGENT: getLeaderById,
  CARD_PLAY_HERO: getLeaderById,
  CARD_PLAY_ABILITY: getAbility,
};

export function resolveCardName(archetype: string, id: string): string {
  return CARD_LOOKUPS[archetype]?.(id)?.name ?? prettifyId(id);
}

// Produced-unit keys use async short ids ("ff", "dd"); resolve to the base unit type
// name ("Fighter") rather than a faction/upgrade variant.
const baseTypeByAsyncId = new Map<string, string>();
for (const unit of units) {
  if (!baseTypeByAsyncId.has(unit.asyncId)) {
    baseTypeByAsyncId.set(unit.asyncId, unit.baseType);
  }
}

export function resolveTechName(id: string): string {
  return getTechData(id)?.name ?? prettifyId(id);
}

export function resolveUnitName(id: string): string {
  return prettifyId(baseTypeByAsyncId.get(id) ?? id);
}

export function resolveAgendaName(id: string): string {
  return agendasById.get(id)?.name ?? prettifyId(id);
}

export function resolveObjectiveName(id: string): string {
  return (
    publicObjById.get(id)?.name ??
    getSecretObjectiveData(id)?.name ??
    prettifyId(id)
  );
}

export function resolvePlanetName(id: string): string {
  const direct = planets.find((p) => p.id === id || p.aliases?.includes(id));
  return direct?.name ?? prettifyId(id);
}

/**
 * Event payloads often carry board positions ("105"), not physical system ids.
 * Prefer the live position -> system map when available so custom maps with an
 * empty tile at position 105 do not render static system 105's planet name.
 */
export function resolveSystemName(
  position: string,
  positionToSystemId?: Record<string, string>,
): string {
  const systemId =
    positionToSystemId === undefined ? position : positionToSystemId[position];
  if (!systemId) return position;
  const stripped = systemId.replace(/^0+/, "") || systemId;
  const sys = systems.find((s) => s.id === stripped || s.id === systemId);
  return sys?.name ?? systemId;
}

export function resolvePlanetsList(underscored: string): string[] {
  return underscored
    .split("_")
    .map((p) => p.trim())
    .filter(Boolean)
    .map(resolvePlanetName);
}

export function formatRelativeTime(timestamp: number, now: number): string {
  const diff = Math.max(0, now - timestamp);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export function formatAbsoluteTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
