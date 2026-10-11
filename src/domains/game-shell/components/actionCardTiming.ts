import { getActionCard } from "@/entities/lookup/actionCards";

/**
 * The window an action card can be played in, reduced to the one word players
 * scan for: When, After, Action, Combat, Agenda, Start, Before or End.
 */
export function actionCardTiming(alias: string): string | null {
  const card = getActionCard(alias);
  if (!card) return null;
  const window = card.window?.trim().toLowerCase() ?? "";
  if (window === "action") return "Action";
  if (/combat|\bhits?\b|sustain damage|bombardment|invasion/.test(window)) {
    return "Combat";
  }
  if (card.phase === "Agenda" || /agenda|vote/.test(window)) return "Agenda";
  if (window.startsWith("when")) return "When";
  if (window.startsWith("after")) return "After";
  if (window.startsWith("before")) return "Before";
  if (window.startsWith("at the start")) return "Start";
  if (window.startsWith("at the end")) return "End";
  return card.phase && card.phase !== "Any" ? card.phase : null;
}
