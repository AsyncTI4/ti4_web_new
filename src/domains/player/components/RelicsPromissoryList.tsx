import { Fragment, type ReactNode } from "react";
import { Group, type GroupProps } from "@mantine/core";
import { Relic } from "./Relic";
import { PromissoryNote } from "./PromissoryNote";

type RelicsPromissoryListProps = {
  relics?: string[];
  promissoryNotes?: string[];
  exhaustedRelics?: string[];
  renderWrapper?: (items: ReactNode[]) => ReactNode;
} & Omit<GroupProps, "children">;

export function RelicsPromissoryList({
  relics = [],
  promissoryNotes = [],
  exhaustedRelics = [],
  renderWrapper,
  gap = 4,
  wrap = "wrap",
  ...groupProps
}: RelicsPromissoryListProps) {
  const items = [
    ...relics.map((relicId, index) => {
      const isExhausted = exhaustedRelics?.includes(relicId);
      return (
        <Relic
          key={`relic-${relicId}-${index}`}
          relicId={relicId}
          isExhausted={!!isExhausted}
        />
      );
    }),
    ...promissoryNotes.map((promissoryNoteId) => (
      <PromissoryNote
        promissoryNoteId={promissoryNoteId}
        key={`pn-${promissoryNoteId}`}
      />
    )),
  ];

  if (renderWrapper) {
    return <Fragment>{renderWrapper(items)}</Fragment>;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <Group gap={gap} wrap={wrap} {...groupProps}>
      {items}
    </Group>
  );
}
