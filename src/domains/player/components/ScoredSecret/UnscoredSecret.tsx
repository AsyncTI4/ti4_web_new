import { Chip } from "@/shared/ui/primitives/Chip";
import { SecretObjectiveIcon } from "@/shared/ui/SecretObjectiveIcon";
import styles from "./ScoredSecret.module.css";
import cx from "clsx";

export function UnscoredSecret() {
  return (
    <Chip
      accent="deepRed"
      className={cx(
        styles.secretCard,
        styles.unscoredKnown,
        styles.redactedCard
      )}
      leftSection={<SecretObjectiveIcon size={18} />}
      title="Unscored Secret"
    />
  );
}
