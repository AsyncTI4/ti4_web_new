import { promissoryNotes } from "../data/promissoryNotes";
import { PromissoryNote } from "../data/types";
import type { FactionColorMap } from "@/context/GameContextProvider";

// Create efficient lookup maps
const promissoryNotesMap = new Map(
  promissoryNotes.map((note) => [note.alias, note])
);

// For faction map, we need to handle multiple promissory notes with same faction
const promissoryNotesByFactionMap = new Map<string, PromissoryNote[]>();
promissoryNotes.forEach((note) => {
  if (note.faction) {
    const existingNotes = promissoryNotesByFactionMap.get(note.faction) || [];
    promissoryNotesByFactionMap.set(note.faction, [...existingNotes, note]);
  }
});

// For source map, we need to handle multiple promissory notes with same source
const promissoryNotesBySourceMap = new Map<string, PromissoryNote[]>();
promissoryNotes.forEach((note) => {
  const existingNotes = promissoryNotesBySourceMap.get(note.source) || [];
  promissoryNotesBySourceMap.set(note.source, [...existingNotes, note]);
});

// Pre-filter different categories
const templatePromissoryNotes = promissoryNotes.filter((note) =>
  note.alias.includes("<color>")
);
const factionSpecificPromissoryNotes = promissoryNotes.filter(
  (note) => note.faction && !note.alias.includes("<color>")
);
const playImmediatelyPromissoryNotes = promissoryNotes.filter(
  (note) => note.playImmediately === true
);
const playAreaPromissoryNotes = promissoryNotes.filter(
  (note) => note.playArea === true
);

/**
 * Get promissory note data by alias
 */
export function getPromissoryNoteByAlias(
  alias: string
): PromissoryNote | undefined {
  return promissoryNotesMap.get(alias);
}

/**
 * Get all promissory notes for a specific faction
 */
export function getPromissoryNotesByFaction(faction: string): PromissoryNote[] {
  return promissoryNotesByFactionMap.get(faction) || [];
}

/**
 * Get all promissory notes from a specific source
 */
export function getPromissoryNotesBySource(source: string): PromissoryNote[] {
  return promissoryNotesBySourceMap.get(source) || [];
}

/**
 * Get template promissory notes (ones with <color> placeholders)
 */
export function getTemplatePromissoryNotes(): PromissoryNote[] {
  return templatePromissoryNotes;
}

/**
 * Get faction-specific promissory notes (non-template)
 */
export function getFactionSpecificPromissoryNotes(): PromissoryNote[] {
  return factionSpecificPromissoryNotes;
}

/**
 * Get promissory note data by ID, handling both faction-specific and color-based formats
 * @param promissoryNoteId - The promissory note ID (e.g., "acq", "red_sftt")
 * @param colorToFaction - Mapping of colors to faction names
 * @returns Object containing the note data and resolved faction/color info
 */
export function getPromissoryNoteData(
  promissoryNoteId: string,
  factionColorMap: FactionColorMap
): {
  noteData: PromissoryNote;
  faction: string;
  color?: string;
  displayName: string;
} | null {
  // First, try to find a direct match (for faction-specific promissory notes)
  let noteData = getPromissoryNoteByAlias(promissoryNoteId);

  if (noteData) {
    // This is a faction-specific promissory note
    const faction = noteData.faction;
    if (!faction) {
      console.warn(
        `Faction-specific promissory note "${promissoryNoteId}" has no faction`
      );
      return null;
    }

    return {
      noteData,
      faction,
      displayName: noteData.name,
    };
  }

  // Try parsing as color_type format (for generic promissory notes)
  const parts = promissoryNoteId.split("_");
  if (parts.length < 2) {
    console.warn(`Invalid promissory note ID format: "${promissoryNoteId}"`);
    return null;
  }

  const color = parts[0];
  const type = parts.slice(1).join("_"); // Handle cases like "multi_part_type"

  // Find the template promissory note (e.g., "<color>_sftt")
  const templateAlias = `<color>_${type}`;
  noteData = getPromissoryNoteByAlias(templateAlias);

  if (!noteData) {
    console.warn(
      `Promissory note template with alias "${templateAlias}" not found`
    );
    return null;
  }

  // Find the faction associated with this color
  const faction = factionColorMap?.[color]?.faction;
  if (!faction) {
    console.warn(`No faction found for color "${color}"`);
    return null;
  }

  // Replace <color> placeholders in the name
  const displayName = noteData.name.replace(/<color>/g, color);

  return {
    noteData,
    faction,
    color,
    displayName,
  };
}

/**
 * Get all promissory notes that should be placed in play area immediately
 */
export function getPlayImmediatelyPromissoryNotes(): PromissoryNote[] {
  return playImmediatelyPromissoryNotes;
}

/**
 * Get all promissory notes that go to play area
 */
export function getPlayAreaPromissoryNotes(): PromissoryNote[] {
  return playAreaPromissoryNotes;
}

/**
 * Search promissory notes by name (case-insensitive partial match)
 */
export function searchPromissoryNotesByName(
  searchTerm: string
): PromissoryNote[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return promissoryNotes.filter(
    (note) =>
      note.name.toLowerCase().includes(lowerSearchTerm) ||
      (note.shortName && note.shortName.toLowerCase().includes(lowerSearchTerm))
  );
}

/**
 * Get all available promissory note sources
 */
export function getPromissoryNoteSources(): string[] {
  return Array.from(promissoryNotesBySourceMap.keys()).sort();
}

/**
 * Get all available promissory note factions
 */
export function getPromissoryNoteFactions(): string[] {
  return Array.from(promissoryNotesByFactionMap.keys()).sort();
}

/**
 * Get all promissory notes
 */
export function getAllPromissoryNotes(): PromissoryNote[] {
  return promissoryNotes;
}
