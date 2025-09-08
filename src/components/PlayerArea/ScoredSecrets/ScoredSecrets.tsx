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

type SecretVariant = "scored" | "unscored";

type SecretWithPopoverProps = {
  secretId: string;
  variant: SecretVariant;
  isOpen: boolean;
  onToggle: (opened: boolean) => void;
  onClick: () => void;
};

function SecretWithPopover({
  secretId,
  variant,
  isOpen,
  onToggle,
  onClick,
}: SecretWithPopoverProps) {
  return (
    <SmoothPopover opened={isOpen} onChange={onToggle}>
      <SmoothPopover.Target>
        <div>
          <ScoredSecret
            secretId={secretId}
            variant={variant}
            onClick={onClick}
          />
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <SecretObjectiveCard secretId={secretId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

export function ScoredSecrets({
  secretsScored,
  knownUnscoredSecrets = {},
  unscoredSecrets,
}: Props) {
  const [selectedSecret, setSelectedSecret] = useState<string | null>(null);

  const scoredIds = Object.keys(secretsScored);
  const knownUnscoredIds = Object.keys(knownUnscoredSecrets);
  const unscored = Math.max(unscoredSecrets - knownUnscoredIds.length, 0);

  return (
    <Stack gap={2}>
      {scoredIds.map((secretId) => (
        <SecretWithPopover
          key={`scored-${secretId}`}
          secretId={secretId}
          variant="scored"
          isOpen={selectedSecret === secretId}
          onToggle={(opened) => setSelectedSecret(opened ? secretId : null)}
          onClick={() => setSelectedSecret(secretId)}
        />
      ))}

      {knownUnscoredIds.map((secretId) => (
        <SecretWithPopover
          key={`unscored-${secretId}`}
          secretId={secretId}
          variant="unscored"
          isOpen={selectedSecret === secretId}
          onToggle={(opened) => setSelectedSecret(opened ? secretId : null)}
          onClick={() => setSelectedSecret(secretId)}
        />
      ))}

      {Array.from({ length: unscored }, (_, index) => (
        <UnscoredSecret key={index} />
      ))}
    </Stack>
  );
}
