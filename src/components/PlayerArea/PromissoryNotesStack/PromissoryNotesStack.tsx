import { Stack } from "@mantine/core";
import { useState } from "react";
import { PromissoryNote } from "../PromissoryNote";
import { EmptyPromissoryNotePlaceholder } from "../PromissoryNote";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { PromissoryNoteCard } from "../PromissoryNoteCard";

type Props = {
  promissoryNotes: string[];
};

export function PromissoryNotesStack({ promissoryNotes }: Props) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  return (
    <Stack gap={4}>
      {promissoryNotes.length > 0 ? (
        promissoryNotes.map((noteId, index) => (
          <SmoothPopover
            key={index}
            opened={selectedNote === noteId}
            onChange={(opened) => setSelectedNote(opened ? noteId : null)}
          >
            <SmoothPopover.Target>
              <div>
                <PromissoryNote
                  promissoryNoteId={noteId}
                  onClick={() => setSelectedNote(noteId)}
                />
              </div>
            </SmoothPopover.Target>
            <SmoothPopover.Dropdown p={0}>
              <PromissoryNoteCard promissoryNoteId={noteId} />
            </SmoothPopover.Dropdown>
          </SmoothPopover>
        ))
      ) : (
        <EmptyPromissoryNotePlaceholder />
      )}
    </Stack>
  );
}
