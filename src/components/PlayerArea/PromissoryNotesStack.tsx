import { Stack } from "@mantine/core";
import { PromissoryNote } from "./PromissoryNote";
import { EmptyPromissoryNotePlaceholder } from "./PromissoryNote";

type Props = {
  promissoryNotes: string[];
};

export function PromissoryNotesStack({ promissoryNotes }: Props) {
  return (
    <Stack gap={4}>
      {promissoryNotes.length > 0 ? (
        promissoryNotes.map((noteId, index) => (
          <PromissoryNote key={index} promissoryNoteId={noteId} />
        ))
      ) : (
        <EmptyPromissoryNotePlaceholder />
      )}
    </Stack>
  );
}
