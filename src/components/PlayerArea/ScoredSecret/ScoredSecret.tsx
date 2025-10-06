import { Image } from "@mantine/core";
import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { Chip } from "@/components/shared/primitives/Chip";
import { isMobileDevice } from "@/utils/isTouchDevice";

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
      leftSection={!isMobileDevice() ? <Image src="/so_icon.png" /> : undefined}
      ribbon
      title={secretName}
    />
  );
}
