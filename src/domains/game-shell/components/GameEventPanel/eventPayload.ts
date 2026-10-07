import type { GameSubEvent } from "@/entities/data/types";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";

export type EventPayload = Record<string, unknown>;
export type SystemNameResolver = (position: string) => string;

export function str(payload: EventPayload, key: string): string | undefined {
  const v = payload[key];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function num(payload: EventPayload, key: string): number | undefined {
  const v = payload[key];
  return typeof v === "number" ? v : undefined;
}

export function stringArray(payload: EventPayload, key: string): string[] {
  const v = payload[key];
  if (!Array.isArray(v)) return [];
  return v.filter((item): item is string => typeof item === "string");
}

export function eventDescription(payload: EventPayload): string | undefined {
  return (
    str(payload, "description") ??
    str(payload, "summary") ??
    str(payload, "message")
  );
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function strategyCardName(
  payload: EventPayload,
  initiative?: number,
): string {
  const explicitName =
    str(payload, "scName") ?? str(payload, "strategyCardName");
  if (explicitName) return explicitName;
  if (initiative === undefined) return "strategy card";
  return getStrategyCardByInitiative(initiative)?.name ?? "strategy card";
}

/**
 * Keeps only entries shaped like a sub-event. Unknown `type` values pass
 * through and are dropped at render time.
 */
export function parseSubEvents(value: unknown): GameSubEvent[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (e): e is GameSubEvent =>
      typeof e === "object" &&
      e !== null &&
      typeof (e as { type?: unknown }).type === "string",
  );
}
