import { actionCards } from "@/entities/data/actionCards";
import { promissoryNotes } from "@/entities/data/promissoryNotes";
import { relics } from "@/entities/data/relics";
import { techs } from "@/entities/data/techs";
import { breakthroughs } from "@/entities/data/breakthroughs";
import { abilities } from "@/entities/data/abilities";
import { leaders } from "@/entities/data/leaders";
import { agendas } from "@/entities/data/agendas";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { secretObjectives } from "@/entities/data/secretObjectives";
import { planets } from "@/entities/data/planets";
import { systems } from "@/entities/data/systems";
import { units } from "@/entities/data/units";

// ---------------------------------------------------------------------------
// Name resolution — resolves raw ids to real display names using client-side
// lookup data. Kept in one place so it can be upgraded as data coverage grows.
// A prettifier is the universal fallback.
// ---------------------------------------------------------------------------

export function prettifyId(id: string): string {
  return id
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

type Named = { name?: string };

function indexBy<T extends Named>(rows: T[], key: (row: T) => string): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    const id = key(row);
    if (id && !map.has(id)) map.set(id, row);
  }
  return map;
}

const actionCardsById = indexBy(actionCards, (r) => r.alias);
const promissoryById = indexBy(promissoryNotes, (r) => r.alias);
const relicsById = indexBy(relics, (r) => r.alias);
const techsById = indexBy(techs, (r) => r.alias);
const breakthroughsById = indexBy(breakthroughs, (r) => r.alias);
const abilitiesById = indexBy(abilities, (r) => r.id);
const leadersById = indexBy(leaders, (r) => r.id);
const agendasById = indexBy(agendas, (r) => r.alias);
const publicObjById = indexBy(publicObjectives, (r) => r.alias);
const secretObjById = indexBy(secretObjectives, (r) => r.alias);

function nameFrom(map: Map<string, Named>, id: string): string {
  return map.get(id)?.name ?? prettifyId(id);
}

export function resolveCardName(archetype: string, id: string): string {
  switch (archetype) {
    case "CARD_PLAY_ACTION_CARD":
      return nameFrom(actionCardsById, id);
    case "CARD_PLAY_PROMISSORY_NOTE":
      return nameFrom(promissoryById, id);
    case "CARD_PLAY_RELIC":
      return nameFrom(relicsById, id);
    case "CARD_PLAY_TECH_EXHAUST":
      return nameFrom(techsById, id);
    case "CARD_PLAY_BREAKTHROUGH":
      return nameFrom(breakthroughsById, id);
    case "CARD_PLAY_AGENT":
    case "CARD_PLAY_HERO":
      return leadersById.get(id)?.name ?? prettifyId(id);
    case "CARD_PLAY_ABILITY":
      return abilitiesById.get(id)?.name ?? prettifyId(id);
    default:
      return prettifyId(id);
  }
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
  return nameFrom(techsById, id);
}

export function resolveUnitName(id: string): string {
  return prettifyId(baseTypeByAsyncId.get(id) ?? id);
}

export function resolveAgendaName(id: string): string {
  return nameFrom(agendasById, id);
}

export function resolveObjectiveName(id: string): string {
  return (
    publicObjById.get(id)?.name ?? secretObjById.get(id)?.name ?? prettifyId(id)
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
  positionToSystemId?: Record<string, string>
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

// ---------------------------------------------------------------------------
// Vote + transaction parsing (defensive against malformed tokens)
// ---------------------------------------------------------------------------

export function summarizeVotes(votes: Record<string, string>): string {
  const parts: string[] = [];
  for (const [outcome, tokenStr] of Object.entries(votes)) {
    let total = 0;
    for (const token of tokenStr.split(";")) {
      const digits = token.match(/_(\d+)$/);
      if (digits) total += Number(digits[1]);
    }
    if (total > 0) parts.push(`${prettifyId(outcome)} ${total}`);
  }
  return parts.join(" — ");
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
