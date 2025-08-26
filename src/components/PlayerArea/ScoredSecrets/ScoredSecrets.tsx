import { Stack } from "@mantine/core";
import { useState } from "react";
import { ScoredSecret } from "../ScoredSecret";
import { EmptyScoredSecretsPlaceholder } from "../ScoredSecret";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { SecretObjectiveCard } from "../SecretObjectiveCard";
import { UnscoredSecret } from "../ScoredSecret/UnscoredSecret";

type Props = {
  secretsScored: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  unscoredSecrets: number;
};

export function ScoredSecrets({
  secretsScored,
  knownUnscoredSecrets = {},
  unscoredSecrets
}: Props) {
  const [selectedSecret, setSelectedSecret] = useState<string | null>(null);

  const hasSecrets =
    Object.values(secretsScored).length > 0 ||
    Object.values(knownUnscoredSecrets).length > 0 ||
    unscoredSecrets > 0;

  return (
    <Stack gap={2}>
      {hasSecrets ? (
        <>
          {/* Scored Secrets */}
          {Object.entries(secretsScored).map(([secretId, cardId]) => (
            <SmoothPopover
              key={`scored-${secretId}`}
              opened={selectedSecret === secretId}
              onChange={(opened) => setSelectedSecret(opened ? secretId : null)}
            >
              <SmoothPopover.Target>
                <div>
                  <ScoredSecret
                    secretId={secretId}
                    cardId={cardId}
                    variant="scored"
                    onClick={() => setSelectedSecret(secretId)}
                  />
                </div>
              </SmoothPopover.Target>
              <SmoothPopover.Dropdown p={0}>
                <SecretObjectiveCard secretId={secretId} />
              </SmoothPopover.Dropdown>
            </SmoothPopover>
          ))}

          {/* Unscored Secrets */}
          {Object.entries(knownUnscoredSecrets).map(([secretId, cardId]) => (
            <SmoothPopover
              key={`unscored-${secretId}`}
              opened={selectedSecret === secretId}
              onChange={(opened) => setSelectedSecret(opened ? secretId : null)}
            >
              <SmoothPopover.Target>
                <div>
                  <ScoredSecret
                    secretId={secretId}
                    cardId={cardId}
                    variant="unscored"
                    onClick={() => setSelectedSecret(secretId)}
                  />
                </div>
              </SmoothPopover.Target>
              <SmoothPopover.Dropdown p={0}>
                <SecretObjectiveCard secretId={secretId} />
              </SmoothPopover.Dropdown>
            </SmoothPopover>
          ))}
          
          {Array.from({length: unscoredSecrets}, (_, index) => (
            <UnscoredSecret key={index} />
          ))}
        </>
      ) : (
        <EmptyScoredSecretsPlaceholder />
      )}
    </Stack>
  );
}
