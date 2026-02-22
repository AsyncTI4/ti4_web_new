import { Group, Stack } from "@mantine/core";
import type { ReactNode } from "react";
import { ScoredSecret } from "../ScoredSecret";
import { UnscoredSecret } from "../ScoredSecret/UnscoredSecret";

type Props = {
  secretsScored: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  unscoredSecrets: number;
  horizontal?: boolean;
  renderWrapper?: (items: ReactNode[]) => ReactNode;
};

export function ScoredSecrets({
  secretsScored,
  knownUnscoredSecrets = {},
  unscoredSecrets,
  horizontal = false,
  renderWrapper,
}: Props) {
  const scoredIds = Object.keys(secretsScored);
  const knownUnscoredIds = Object.keys(knownUnscoredSecrets);
  const unscored = Math.max(unscoredSecrets - knownUnscoredIds.length, 0);
  const Wrapper = horizontal ? Group : Stack;
  const secrets: ReactNode[] = [];

  scoredIds.forEach((secretId) => {
    secrets.push(
      <ScoredSecret key={`scored-${secretId}`} secretId={secretId} variant="scored" />,
    );
  });

  knownUnscoredIds.forEach((secretId) => {
    secrets.push(
      <ScoredSecret key={`unscored-${secretId}`} secretId={secretId} variant="unscored" />,
    );
  });

  for (let index = 0; index < unscored; index += 1) {
    secrets.push(<UnscoredSecret key={`placeholder-${index}`} />);
  }

  if (renderWrapper) {
    return renderWrapper(secrets);
  }

  return <Wrapper gap={2}>{secrets}</Wrapper>;
}
