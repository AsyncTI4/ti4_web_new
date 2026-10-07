import { getSecretObjectiveData } from "@/entities/lookup/secretObjectives";
import { processCardData, type ProcessedCardData } from "./cardDataProcessor";

type PhaseColor = "red" | "blue" | "orange";

type ProcessedSecretData = ProcessedCardData & {
  phase: string;
  phaseColor: PhaseColor;
};

export type SecretSection = {
  title: string;
  count: number;
  items: Array<ProcessedSecretData & { percentage?: number }>;
  phaseColor: PhaseColor;
};

const PHASE_ORDER = ["ACTION", "AGENDA", "STATUS"];

const PHASE_COLORS: Record<string, PhaseColor> = {
  action: "red",
  agenda: "blue",
  status: "orange",
};

const getPhaseColor = (phase: string): PhaseColor =>
  PHASE_COLORS[phase.toLowerCase()] ?? "red";

function toSecretCard(id: string) {
  const secret = getSecretObjectiveData(id);
  if (!secret) return undefined;
  return { name: secret.name, text: secret.text, id: secret.alias };
}

/** Groups secret IDs by name, most common first. */
export function processSecretObjectives(
  secretIds: string[],
): ProcessedSecretData[] {
  return processCardData(secretIds, toSecretCard, "percentage").map((card) => {
    const phase = getSecretObjectiveData(card.aliases[0])?.phase ?? "";
    return { ...card, phase, phaseColor: getPhaseColor(phase) };
  });
}

function groupByPhase(items: ProcessedSecretData[]) {
  const byPhase = new Map<string, ProcessedSecretData[]>();
  for (const item of items) {
    const phase = item.phase.toUpperCase();
    byPhase.set(phase, [...(byPhase.get(phase) ?? []), item]);
  }
  return PHASE_ORDER.flatMap((phase) => {
    const phaseItems = byPhase.get(phase);
    if (!phaseItems?.length) return [];
    return [
      {
        phase,
        items: phaseItems,
        count: phaseItems.reduce((sum, item) => sum + item.count, 0),
        phaseColor: getPhaseColor(phase),
      },
    ];
  });
}

/** Deck sections (with draw percentages) then discard sections, each in phase order. */
export function createSecretSections(
  deckData: ProcessedSecretData[],
  discardData: ProcessedSecretData[],
  deckIds: string[],
): SecretSection[] {
  const deckSections = groupByPhase(deckData).map(
    ({ phase, items, count, phaseColor }) => ({
      title: `${phase} Phase Deck`,
      count,
      phaseColor,
      items: items.map((item) => ({
        ...item,
        percentage: (item.count / deckIds.length) * 100,
      })),
    }),
  );

  const discardSections = groupByPhase(discardData).map(
    ({ phase, items, count, phaseColor }) => ({
      title: `${phase} Phase Discard`,
      count,
      phaseColor,
      items,
    }),
  );

  return [...deckSections, ...discardSections];
}
