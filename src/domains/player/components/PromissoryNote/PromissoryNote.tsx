import { getPromissoryNoteData } from "@/entities/lookup/promissoryNotes";
import { ChipWithPopover } from "@/shared/ui/primitives/ChipWithPopover";
import { useFactionColors } from "@/hooks/useFactionColors";
import { PromissoryNoteCard } from "../PromissoryNoteCard";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import styles from "./PromissoryNote.module.css";

type Props = {
  promissoryNoteId: string;
  onClick?: () => void;
};

export function PromissoryNote({ promissoryNoteId, onClick }: Props) {
  const factionColorMap = useFactionColors();
  const promissoryNoteData = getPromissoryNoteData(
    promissoryNoteId,
    factionColorMap
  );

  if (!promissoryNoteData) return null;

  const { noteData, faction, displayName } = promissoryNoteData;

  return (
    <ChipWithPopover
      accent="cyan"
      className={styles.pnChip}
      leftSection={
        <FactionIcon faction={faction} w={18} h={18} style={{ objectFit: "contain" }} />
      }
      title={noteData.shortName || displayName}
      onClick={onClick}
      dropdownContent={<PromissoryNoteCard promissoryNoteId={promissoryNoteId} />}
    />
  );
}
