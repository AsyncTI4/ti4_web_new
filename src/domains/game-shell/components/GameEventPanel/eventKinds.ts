import type { ComponentType } from "react";
import {
  IconArrowsLeftRight,
  IconAtom,
  IconBolt,
  IconBuildingFactory2,
  IconCards,
  IconCpu,
  IconDiamond,
  IconFlag,
  IconGavel,
  IconHexagon,
  IconPlayerPause,
  IconRocket,
  IconStar,
  IconSwords,
  IconTerminal2,
  IconTicket,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react";
import type { GameEvent } from "@/entities/data/types";
import { parseSubEvents, str } from "./eventPayload";

export type EventFilter =
  | "all"
  | "moves"
  | "combat"
  | "trades"
  | "scoring"
  | "agenda";

/** Filter chips, each keyed to the signal its events carry. */
export const EVENT_FILTERS: {
  key: EventFilter;
  label: string;
  tone?: string;
}[] = [
  { key: "all", label: "All" },
  { key: "moves", label: "Moves", tone: "var(--gd-blue)" },
  { key: "combat", label: "Combat", tone: "var(--gd-red)" },
  { key: "trades", label: "Trades", tone: "var(--gd-cyan)" },
  { key: "scoring", label: "Scoring", tone: "var(--gd-green)" },
  { key: "agenda", label: "Agenda", tone: "var(--gd-purple)" },
];

type Glyph = ComponentType<{ size?: number; stroke?: number }>;

export type EventKind = {
  /** Comma-separated signal triplet for the glyph and scrubber tick. */
  tone: string;
  Glyph: Glyph;
};

const SCORING = new Set(["OBJECTIVE_SCORED", "STATUS_SCORING", "GAME_ENDED"]);

export function hasCombat(event: GameEvent): boolean {
  if (event.archetype !== "TACTICAL_ACTION") return false;
  if (str(event.payload ?? {}, "combat")) return true;
  return parseSubEvents(event.payload?.subEvents).some(
    (sub) => sub.type === "COMBAT",
  );
}

export function matchesFilter(event: GameEvent, filter: EventFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "moves":
      return (
        event.archetype === "TACTICAL_ACTION" ||
        event.archetype === "PRODUCTION"
      );
    case "combat":
      return hasCombat(event);
    case "trades":
      return event.archetype === "TRANSACTION";
    case "scoring":
      return SCORING.has(event.archetype);
    case "agenda":
      return event.archetype === "AGENDA_RESOLVED";
  }
}

const KINDS: Record<string, EventKind> = {
  TACTICAL_ACTION: { tone: "var(--gd-blue)", Glyph: IconRocket },
  PRODUCTION: { tone: "var(--gd-blue)", Glyph: IconBuildingFactory2 },
  TRANSACTION: { tone: "var(--gd-cyan)", Glyph: IconArrowsLeftRight },
  OBJECTIVE_SCORED: { tone: "var(--gd-green)", Glyph: IconStar },
  STATUS_SCORING: { tone: "var(--gd-green)", Glyph: IconStar },
  GAME_ENDED: { tone: "var(--gd-yellow)", Glyph: IconTrophy },
  AGENDA_RESOLVED: { tone: "var(--gd-purple)", Glyph: IconGavel },
  CARD_PLAY_ACTION_CARD: { tone: "var(--gd-red)", Glyph: IconBolt },
  CARD_PLAY_PROMISSORY_NOTE: { tone: "var(--gd-cyan)", Glyph: IconTicket },
  CARD_PLAY_AGENT: { tone: "var(--gd-green)", Glyph: IconUser },
  CARD_PLAY_HERO: { tone: "var(--gd-green)", Glyph: IconUser },
  CARD_PLAY_RELIC: { tone: "var(--gd-yellow)", Glyph: IconDiamond },
  CARD_PLAY_TECH_EXHAUST: { tone: "var(--gd-yellow)", Glyph: IconCpu },
  TECH_RESEARCHED: { tone: "var(--gd-yellow)", Glyph: IconCpu },
  CARD_PLAY_BREAKTHROUGH: { tone: "var(--gd-teal)", Glyph: IconAtom },
  CARD_PLAY_ABILITY: { tone: "var(--gd-purple)", Glyph: IconHexagon },
  SC_PICKED: { tone: "var(--gd-gray)", Glyph: IconCards },
  SC_PLAYED: { tone: "var(--gd-gray)", Glyph: IconCards },
  TURN: { tone: "var(--gd-gray)", Glyph: IconPlayerPause },
  MANUAL_COMMAND: { tone: "var(--gd-gray)", Glyph: IconTerminal2 },
};

const COMBAT_KIND: EventKind = { tone: "var(--gd-red)", Glyph: IconSwords };
const DEFAULT_KIND: EventKind = { tone: "var(--gd-gray)", Glyph: IconFlag };

export function eventKind(event: GameEvent): EventKind {
  if (hasCombat(event)) return COMBAT_KIND;
  return KINDS[event.archetype] ?? DEFAULT_KIND;
}
