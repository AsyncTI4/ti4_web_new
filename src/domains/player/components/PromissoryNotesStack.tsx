import { Stack } from "@mantine/core";
import { PromissoryNote } from "./PromissoryNote";

type Props = {
  promissoryNotes: string[];
};

export function PromissoryNotesStack({ promissoryNotes }: Props) {
  return (
    <Stack gap={2}>
      {promissoryNotes.length > 0
        ? promissoryNotes.map((noteId, index) => (
            <PromissoryNote promissoryNoteId={noteId} key={index} />
          ))
        : undefined}
    </Stack>
  );
}
