import { Group, Stack } from "@mantine/core";
import { ScoredSecret } from "../ScoredSecret";
import { UnscoredSecret } from "../ScoredSecret/UnscoredSecret";

type Props = {
  secretsScored: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  unscoredSecrets: number;
  horizontal?: boolean;
};

export function ScoredSecrets({
  secretsScored,
  knownUnscoredSecrets = {},
  unscoredSecrets,
  horizontal = false,
}: Props) {
  const scoredIds = Object.keys(secretsScored);
  const knownUnscoredIds = Object.keys(knownUnscoredSecrets);
  const unscored = Math.max(unscoredSecrets - knownUnscoredIds.length, 0);
  const Wrapper = horizontal ? Group : Stack;

  return (
    <Wrapper gap={2}>
      {scoredIds.map((secretId) => (
        <ScoredSecret
          key={`scored-${secretId}`}
          secretId={secretId}
          variant="scored"
        />
      ))}

      {knownUnscoredIds.map((secretId) => (
        <ScoredSecret
          key={`unscored-${secretId}`}
          secretId={secretId}
          variant="unscored"
        />
      ))}

      {Array.from({ length: unscored }, (_, index) => (
        <UnscoredSecret key={index} />
      ))}
    </Wrapper>
  );
}
