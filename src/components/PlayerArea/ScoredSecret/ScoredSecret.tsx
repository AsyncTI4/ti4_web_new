import { Image } from "@mantine/core";
import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { ChipWithPopover } from "@/components/shared/primitives/ChipWithPopover";
import { SecretObjectiveCard } from "../SecretObjectiveCard";

type Props = {
  secretId: string;
  onClick?: () => void;
  variant?: "scored" | "unscored";
};

export function ScoredSecret({ secretId, onClick, variant = "scored" }: Props) {
  const secretData = getSecretObjectiveData(secretId);
  const secretName = secretData?.name || secretId;
  const isScored = variant === "scored";

  return (
    <ChipWithPopover
      accent={isScored ? "red" : "gray"}
      leftSection={<Image src="/so_icon.png" />}
      ribbon
      title={secretName}
      onClick={onClick}
      dropdownContent={<SecretObjectiveCard secretId={secretId} />}
    />
  );
}
