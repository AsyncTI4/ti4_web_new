import { Group, type GroupProps } from "@mantine/core";
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
}: PlayerCardRelicsPromissoryAreaProps) {
  const secretsNode = showSecrets ? (
    <ScoredSecrets
      secretsScored={secretsScored}
      knownUnscoredSecrets={knownUnscoredSecrets}
      unscoredSecrets={unscoredSecrets}
      horizontal={horizontal}
    />
  ) : null;

  return (
    <Group gap={gap} wrap={wrap}>
      <RelicsPromissoryList
        relics={relics}
        promissoryNotes={promissoryNotes}
        exhaustedRelics={exhaustedRelics}
      />
      {secretsNode}
    </Group>
  );
}
