import { Stack } from "@mantine/core";
import { ScoredSecret } from "./ScoredSecret";
import { EmptyScoredSecretsPlaceholder } from "./ScoredSecret";

type Props = {
  secretsScored: Record<string, number>;
};

export function ScoredSecrets({ secretsScored }: Props) {
  return (
    <Stack gap={2}>
      {Object.values(secretsScored).length > 0 ? (
        Object.entries(secretsScored).map(([secretId, score]) => (
          <ScoredSecret key={secretId} secretId={secretId} score={score} />
        ))
      ) : (
        <EmptyScoredSecretsPlaceholder />
      )}
    </Stack>
  );
}
