import { useState, type CSSProperties } from "react";
import { getPromissoryNoteData } from "@/entities/lookup/promissoryNotes";
import { useFactionColors } from "@/hooks/useFactionColors";
import { PromissoryNoteCard } from "@/domains/cards/components/PromissoryNoteCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { getFactionImage } from "@/entities/lookup/factions";
import { resolvePrimaryRgb } from "@/entities/lookup/colors";
import type { FactionColorMap } from "@/entities/game/types";
import {
  ObjectGlyph,
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";
import { searchKey } from "@/domains/search/searchKeys";
import styles from "./PromissoryNote.module.css";

type Props = {
  promissoryNoteId: string;
  onClick?: () => void;
  showDetails?: boolean;
};

/** The owner's colour as a space-separated RGB triplet for the ticket stub. */
function getOwnerRgb(
  faction: string,
  color: string | undefined,
  factionColorMap: FactionColorMap,
): string | undefined {
  const ownerColor =
    color ??
    Object.entries(factionColorMap).find(
      ([, data]) => data.faction === faction,
    )?.[0];
  const rgb = ownerColor ? resolvePrimaryRgb(ownerColor) : undefined;
  return rgb ? `${rgb.red}, ${rgb.green}, ${rgb.blue}` : undefined;
}

/**
 * IOU ticket: a stub in the owner's colour carries their mark and tears off
 * along a notched perforation; the sheet keeps its dog-ear. Whose note it is
 * reads before what it says.
 */
export function PromissoryNote({
  promissoryNoteId,
  onClick,
  showDetails = true,
}: Props) {
  const [opened, setOpened] = useState(false);
  const factionColorMap = useFactionColors();
  const promissoryNoteData = getPromissoryNoteData(
    promissoryNoteId,
    factionColorMap,
  );

  if (!promissoryNoteData) return null;

  const { noteData, faction, color, displayName } = promissoryNoteData;
  const name = noteData.shortName || displayName;
  const ownerRgb = getOwnerRgb(faction, color, factionColorMap);
  const handleClick = () => {
    if (showDetails) setOpened((o) => !o);
    onClick?.();
  };

  const shell = (
    <ObjectShell
      className={styles.pn}
      label={`${name} · from ${faction}`}
      onClick={handleClick}
      searchKey={searchKey("promissory", promissoryNoteId)}
      style={ownerRgb ? ({ "--pc": ownerRgb } as CSSProperties) : undefined}
    >
      <ObjectGlyph src={getFactionImage(faction)} size={16} />
      <ObjectLabel>{name}</ObjectLabel>
    </ObjectShell>
  );

  if (!showDetails) return shell;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>{shell}</SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <PromissoryNoteCard promissoryNoteId={promissoryNoteId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
