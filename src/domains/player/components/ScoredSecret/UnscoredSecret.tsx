import { Chip } from "@/shared/ui/primitives/Chip";
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
      leftIconSrc="/so_icon.png"
      leftIconSize={16}
      title="Unscored Secret"
    />
  );
}
