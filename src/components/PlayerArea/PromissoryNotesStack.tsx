import { Stack } from "@mantine/core";
import { PromissoryNote } from "./PromissoryNote";
import { EmptyPromissoryNotePlaceholder } from "./PromissoryNote";

type Props = {
  promissoryNotes: string[];
  colorToFaction: Record<string, string>;
};

export function PromissoryNotesStack({
  promissoryNotes,
  colorToFaction,
}: Props) {
  return (
    <Stack gap={4}>
      {promissoryNotes.length > 0 ? (
        promissoryNotes.map((noteId, index) => (
          <PromissoryNote
            key={index}
            promissoryNoteId={noteId}
            colorToFaction={colorToFaction}
          />
        ))
      ) : (
        <EmptyPromissoryNotePlaceholder />
      )}
    </Stack>
  );
}
