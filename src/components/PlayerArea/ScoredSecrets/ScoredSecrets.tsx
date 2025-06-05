import { Stack } from "@mantine/core";
import { useState } from "react";
import { ScoredSecret } from "../ScoredSecret";
import { EmptyScoredSecretsPlaceholder } from "../ScoredSecret";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { SecretObjectiveCard } from "../SecretObjectiveCard";

type Props = {
  secretsScored: Record<string, number>;
};

export function ScoredSecrets({ secretsScored }: Props) {
  const [selectedSecret, setSelectedSecret] = useState<string | null>(null);

  return (
    <Stack gap={2}>
      {Object.values(secretsScored).length > 0 ? (
        Object.entries(secretsScored).map(([secretId, score]) => (
          <SmoothPopover
            key={secretId}
            opened={selectedSecret === secretId}
            onChange={(opened) => setSelectedSecret(opened ? secretId : null)}
          >
            <SmoothPopover.Target>
              <div>
                <ScoredSecret
                  secretId={secretId}
                  score={score}
                  onClick={() => setSelectedSecret(secretId)}
                />
              </div>
            </SmoothPopover.Target>
            <SmoothPopover.Dropdown p={0}>
              <SecretObjectiveCard secretId={secretId} />
            </SmoothPopover.Dropdown>
          </SmoothPopover>
        ))
      ) : (
        <EmptyScoredSecretsPlaceholder />
      )}
    </Stack>
  );
}
