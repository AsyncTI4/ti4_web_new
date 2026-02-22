import { Group, type GroupProps } from "@mantine/core";
import type { ReactNode } from "react";
import { ScoredSecrets } from "./ScoredSecrets";
import { RelicsPromissoryList } from "./RelicsPromissoryList";

type PlayerCardRelicsPromissoryAreaProps = {
  relics: string[];
  promissoryNotes: string[];
  exhaustedRelics?: string[];
  secretsScored?: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  unscoredSecrets?: number;
  horizontal?: boolean;
  gap?: number | string;
  showSecrets?: boolean;
  wrap?: GroupProps["wrap"];
  renderArea?: (content: {
    items: ReactNode[];
    secrets: ReactNode | null;
  }) => ReactNode;
  secretsRenderWrapper?: (items: ReactNode[]) => ReactNode;
};

export function PlayerCardRelicsPromissoryArea({
  relics = [],
  promissoryNotes = [],
  exhaustedRelics = [],
  secretsScored = {},
  knownUnscoredSecrets = {},
  unscoredSecrets = 0,
  horizontal = false,
  gap = 4,
  showSecrets = false,
  wrap = "wrap",
  renderArea,
  secretsRenderWrapper,
}: PlayerCardRelicsPromissoryAreaProps) {
  const secretsNode = showSecrets ? (
    <ScoredSecrets
      secretsScored={secretsScored}
      knownUnscoredSecrets={knownUnscoredSecrets}
      unscoredSecrets={unscoredSecrets}
      horizontal={horizontal}
      renderWrapper={secretsRenderWrapper}
    />
  ) : null;

  return (
    <RelicsPromissoryList
      relics={relics}
      promissoryNotes={promissoryNotes}
      exhaustedRelics={exhaustedRelics}
      renderWrapper={(items) => {
        if (!showSecrets && items.length === 0) {
          return null;
        }

        const content = renderArea
          ? renderArea({ items, secrets: secretsNode })
          : (
              <Group gap={gap} wrap={wrap}>
                {items}
                {secretsNode}
              </Group>
            );

        return content;
      }}
    />
  );
}
