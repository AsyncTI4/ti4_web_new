import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { Chip } from "@/components/shared/primitives/Chip";
import { useFactionColors } from "@/hooks/useFactionColors";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { useState } from "react";
import { PromissoryNoteCard } from "../PromissoryNoteCard";
import { FactionIcon } from "@/components/shared/FactionIcon";
import { cdnImage } from "@/data/cdnImage";
import { Image } from "@mantine/core";

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
            leftSection={<FactionIcon faction={faction} />}
            title={noteData.shortName || displayName}
            strong={strong}
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
