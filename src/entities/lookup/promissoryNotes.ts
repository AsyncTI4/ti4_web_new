import { promissoryNotes } from "@/entities/data/promissoryNotes";
import { indexBy } from "@/entities/lookup/indexBy";
import type { PromissoryNote } from "@/entities/data/types";
import type { FactionColorMap } from "@/app/providers/context/types";

const promissoryNotesMap = indexBy(
  promissoryNotes.filter((note) => !note.homebrewReplacesID),
  (note) => note.alias
);

function getPromissoryNoteByAlias(alias: string): PromissoryNote | undefined {
  return promissoryNotesMap.get(alias);
}

/**
 * Resolves a promissory note ID in either faction-specific ("acq") or
 * color-based ("red_sftt") form to its data and owning faction.
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
  let noteData = getPromissoryNoteByAlias(promissoryNoteId);

  if (noteData) {
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

  const parts = promissoryNoteId.split("_");
  if (parts.length < 2) {
    console.warn(`Invalid promissory note ID format: "${promissoryNoteId}"`);
    return null;
  }

  const color = parts[0];
  const type = parts.slice(1).join("_");

  const templateAlias = `<color>_${type}`;
  noteData = getPromissoryNoteByAlias(templateAlias);

  if (!noteData) {
    console.warn(
      `Promissory note template with alias "${templateAlias}" not found`
    );
    return null;
  }

  const faction = factionColorMap?.[color]?.faction;
  if (!faction) {
    console.warn(`No faction found for color "${color}"`);
    return null;
  }

  const displayName = noteData.name.replace(/<color>/g, color);

  return {
    noteData,
    faction,
    color,
    displayName,
  };
}
