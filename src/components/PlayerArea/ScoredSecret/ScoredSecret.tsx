import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { ChipWithPopover } from "@/components/shared/primitives/ChipWithPopover";
import { SecretObjectiveCard } from "../SecretObjectiveCard";
import styles from "./ScoredSecret.module.css";
import { SecretObjectiveIcon } from "@/components/shared/SecretObjectiveIcon";

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
      className={styles.secretCard}
      accent={isScored ? "red" : "gray"}
      leftSection={<SecretObjectiveIcon />}
      ribbon
      title={secretName}
      onClick={onClick}
      dropdownContent={<SecretObjectiveCard secretId={secretId} />}
    />
  );
}
