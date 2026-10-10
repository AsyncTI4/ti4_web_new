import { getSecretObjectiveData } from "@/entities/lookup/secretObjectives";
import { ChipWithPopover } from "@/shared/ui/primitives/ChipWithPopover";
import { SecretObjectiveCard } from "@/domains/cards/components/SecretObjectiveCard";
import styles from "./ScoredSecret.module.css";
import cx from "clsx";

type Props = {
  secretId: string;
  onClick?: () => void;
  variant?: "scored" | "unscored";
  showDetails?: boolean;
};

export function ScoredSecret({
  secretId,
  onClick,
  variant = "scored",
  showDetails,
}: Props) {
  const secretData = getSecretObjectiveData(secretId);
  const secretName = secretData?.name || secretId;
  const isScored = variant === "scored";

  return (
    <ChipWithPopover
      className={cx(styles.secretCard, !isScored && styles.unscoredKnown)}
      accent={isScored ? "red" : "gray"}
      leftIconSrc="/so_icon.png"
      leftIconSize={16}
      title={secretName}
      onClick={onClick}
      showDetails={showDetails}
      dropdownContent={<SecretObjectiveCard secretId={secretId} />}
    />
  );
}
