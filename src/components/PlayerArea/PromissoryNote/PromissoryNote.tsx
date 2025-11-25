import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { ChipWithPopover } from "@/components/shared/primitives/ChipWithPopover";
import { useFactionColors } from "@/hooks/useFactionColors";
import { PromissoryNoteCard } from "../PromissoryNoteCard";
import { FactionIcon } from "@/components/shared/FactionIcon";

type Props = {
  promissoryNoteId: string;
  onClick?: () => void;
  strong?: boolean;
};

export function PromissoryNote({
  promissoryNoteId,
  onClick,
  strong = true,
}: Props) {
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
      ribbon
      strong={strong}
      leftSection={<FactionIcon faction={faction} />}
      title={noteData.shortName || displayName}
      onClick={onClick}
      dropdownContent={<PromissoryNoteCard promissoryNoteId={promissoryNoteId} />}
      px={8}
      py={4}
    />
  );
}
