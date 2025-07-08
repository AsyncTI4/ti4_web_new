import { PlayerData, SecretObjective } from "@/data/types";
import { getSecretObjectiveData } from "@/lookup/secretObjectives";

export type SecretObjectiveWithPhase = SecretObjective & {
  phaseColor: "red" | "blue" | "orange";
};

export type ProcessedSecretData = {
  name: string;
  aliases: string[];
  count: number;
  text: string;
  phase: string;
  phaseColor: "red" | "blue" | "orange";
};

export type SecretSection = {
  title: string;
  count: number;
  items: Array<ProcessedSecretData & { percentage?: number }>;
  phaseColor: "red" | "blue" | "orange";
};

// Get phase color based on secret objective phase
function getPhaseColor(phase: string): "red" | "blue" | "orange" {
  const normalizedPhase = phase.toLowerCase();
  switch (normalizedPhase) {
    case "action":
      return "red";
    case "agenda":
      return "blue";
    case "status":
      return "orange";
    default:
      return "red"; // Default to red if phase is unknown
  }
}

// Get all scored secret IDs from all players
function getScoredSecretIds(playerData: PlayerData[]): Set<string> {
  const scoredIds = new Set<string>();

  playerData.forEach((player) => {
    // secretsScored is Record<string, number> where key is secret ID
    Object.keys(player.secretsScored || {}).forEach((secretId) => {
      scoredIds.add(secretId);
    });
  });

  return scoredIds;
}

// Process secret objectives with filtering and grouping
export function processSecretObjectives(
  secretIds: string[],
  playerData: PlayerData[]
): ProcessedSecretData[] {
  const scoredSecretIds = getScoredSecretIds(playerData);

  // Filter out scored secrets
  const filteredSecretIds = secretIds.filter((id) => !scoredSecretIds.has(id));

  const secretMap = new Map<
    string,
    {
      aliases: string[];
      text: string;
      phase: string;
      phaseColor: "red" | "blue" | "orange";
    }
  >();

  filteredSecretIds.forEach((secretId) => {
    const secret = getSecretObjectiveData(secretId);
    if (!secret) {
      console.warn(`Secret objective with ID "${secretId}" not found`);
      return;
    }

    const phaseColor = getPhaseColor(secret.phase);
    const existing = secretMap.get(secret.name);

    secretMap.set(secret.name, {
      aliases: existing
        ? existing.aliases.concat(secret.alias)
        : [secret.alias],
      text: secret.text,
      phase: secret.phase,
      phaseColor,
    });
  });

  // Convert to array
  const processedSecrets = Array.from(secretMap.entries()).map(
    ([name, data]) => ({
      name,
      aliases: data.aliases,
      count: data.aliases.length,
      text: data.text,
      phase: data.phase,
      phaseColor: data.phaseColor,
    })
  );

  // Sort by count (most common first) within each phase
  processedSecrets.sort((a, b) => b.count - a.count);

  return processedSecrets;
}

// Create sections grouped by phase in the specified order
export function createSecretSections(
  deckData: ProcessedSecretData[],
  discardData: ProcessedSecretData[],
  deckIds: string[]
): SecretSection[] {
  const phaseOrder = ["ACTION", "AGENDA", "STATUS"];

  const sections: SecretSection[] = [];

  // Group deck data by phase
  const deckByPhase = new Map<string, ProcessedSecretData[]>();
  deckData.forEach((item) => {
    const phase = item.phase.toUpperCase();
    if (!deckByPhase.has(phase)) {
      deckByPhase.set(phase, []);
    }
    deckByPhase.get(phase)!.push(item);
  });

  // Create deck sections in specified order
  phaseOrder.forEach((phase) => {
    const phaseData = deckByPhase.get(phase) || [];
    if (phaseData.length > 0) {
      const phaseColor = getPhaseColor(phase);
      sections.push({
        title: `${phase} Phase Deck`,
        count: phaseData.reduce((sum, item) => sum + item.count, 0),
        items: phaseData.map((item) => ({
          ...item,
          percentage: (item.count / deckIds.length) * 100,
        })),
        phaseColor,
      });
    }
  });

  // Add discard section if there are any discarded secrets
  if (discardData.length > 0) {
    // Group discard data by phase
    const discardByPhase = new Map<string, ProcessedSecretData[]>();
    discardData.forEach((item) => {
      const phase = item.phase.toUpperCase();
      if (!discardByPhase.has(phase)) {
        discardByPhase.set(phase, []);
      }
      discardByPhase.get(phase)!.push(item);
    });

    // Create discard sections in specified order
    phaseOrder.forEach((phase) => {
      const phaseData = discardByPhase.get(phase) || [];
      if (phaseData.length > 0) {
        const phaseColor = getPhaseColor(phase);
        sections.push({
          title: `${phase} Phase Discard`,
          count: phaseData.reduce((sum, item) => sum + item.count, 0),
          items: phaseData, // No percentages for discard
          phaseColor,
        });
      }
    });
  }

  return sections;
}
