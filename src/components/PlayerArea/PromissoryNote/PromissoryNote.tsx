import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { Chip } from "@/components/shared/primitives/Chip";
import { useFactionColors } from "@/hooks/useFactionColors";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { useState } from "react";
import { PromissoryNoteCard } from "../PromissoryNoteCard";
import { FactionIcon } from "@/components/shared/FactionIcon";

type Props = {
  promissoryNoteId: string;
  onClick?: () => void;
};

export function PromissoryNote({ promissoryNoteId, onClick }: Props) {
  const [opened, setOpened] = useState(false);
  const factionColorMap = useFactionColors();
  const promissoryNoteData = getPromissoryNoteData(
    promissoryNoteId,
    factionColorMap
  );
  if (!promissoryNoteData) return null;
  const { noteData, faction, displayName } = promissoryNoteData;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div>
          <Chip
            accent="cyan"
            onClick={() => {
              setOpened((o) => !o);
              if (onClick) onClick();
            }}
            ribbon
            leftSection={<FactionIcon faction={faction!} />}
            title={noteData.shortName || displayName}
            strong
            px={8}
            py={4}
          />
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <PromissoryNoteCard promissoryNoteId={promissoryNoteId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
