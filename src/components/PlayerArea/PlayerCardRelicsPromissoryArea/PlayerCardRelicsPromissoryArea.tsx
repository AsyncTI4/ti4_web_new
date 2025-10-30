import { Group } from "@mantine/core";
import { Relic } from "../Relic";
import { PromissoryNote } from "../PromissoryNote";
import { ScoredSecrets } from "../ScoredSecrets";
import type { PlayerData } from "@/data/types";

type PlayerCardRelicsPromissoryAreaProps = {
  relics: string[];
  promissoryNotes: string[];
  exhaustedRelics?: string[];
  secretsScored?: string[];
  knownUnscoredSecrets?: string[];
  unscoredSecrets?: number;
  horizontal?: boolean;
  gap?: number | string;
  showSecrets?: boolean;
};

export function PlayerCardRelicsPromissoryArea({
  relics = [],
  promissoryNotes = [],
  exhaustedRelics = [],
  secretsScored = [],
  knownUnscoredSecrets = [],
  unscoredSecrets = 0,
  horizontal = false,
  gap = 4,
  showSecrets = false,
}: PlayerCardRelicsPromissoryAreaProps) {
  return (
    <Group gap={gap}>
      {relics.map((relicId, index) => {
        const isExhausted = exhaustedRelics?.includes(relicId);
        return (
          <Relic key={index} relicId={relicId} isExhausted={!!isExhausted} />
        );
      })}
      {promissoryNotes.map((pn) => (
        <PromissoryNote promissoryNoteId={pn} key={pn} />
      ))}
      {showSecrets && (
        <ScoredSecrets
          secretsScored={secretsScored}
          knownUnscoredSecrets={knownUnscoredSecrets}
          unscoredSecrets={unscoredSecrets}
          horizontal={horizontal}
        />
      )}
    </Group>
  );
}

