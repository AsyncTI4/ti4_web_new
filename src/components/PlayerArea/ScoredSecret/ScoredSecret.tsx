import { Image } from "@mantine/core";
import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { Chip } from "@/components/shared/primitives/Chip";

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
    <Chip
      accent={isScored ? "red" : "gray"}
      onClick={onClick}
      leftSection={<Image src="/so_icon.png" />}
      ribbon
      title={secretName}
    />
  );
}
