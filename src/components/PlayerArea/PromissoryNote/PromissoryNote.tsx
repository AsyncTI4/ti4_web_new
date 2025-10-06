import { Image } from "@mantine/core";
import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { Chip } from "@/components/shared/primitives/Chip";
import { useFactionColors } from "@/hooks/useFactionColors";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { useState } from "react";
import { PromissoryNoteCard } from "../PromissoryNoteCard";
import { useFactionImages } from "@/hooks/useFactionImages";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  promissoryNoteId: string;
  onClick?: () => void;
};

export function PromissoryNote({ promissoryNoteId, onClick }: Props) {
  const [opened, setOpened] = useState(false);
  const factionColorMap = useFactionColors();
  const factionImages = useFactionImages();
  const promissoryNoteData = getPromissoryNoteData(
    promissoryNoteId,
    factionColorMap
  );
  if (!promissoryNoteData) return null;
  const { noteData, faction, displayName } = promissoryNoteData;
  const factionIcon = factionImages[faction!]?.image;

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
            leftSection={
              !isMobileDevice() ? <Image src={factionIcon} /> : undefined
            }
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
