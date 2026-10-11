import type { ReactNode } from "react";
import cx from "clsx";
import styles from "./RailLabel.module.css";

type Props = {
  children: ReactNode;
  /** Right-hand meta (a count, a target, a legend). */
  meta?: ReactNode;
  /** Extend a hairline from the label to the meta. */
  rule?: boolean;
  className?: string;
};

/** Engraved section label: the theme's label voice, uppercase, ink-lo. */
export function RailLabel({ children, meta, rule = false, className }: Props) {
  return (
    <div className={cx(styles.row, rule && styles.ruled, className)}>
      <span className={styles.label}>{children}</span>
      {rule && <span className={styles.rule} aria-hidden="true" />}
      {meta !== undefined && <span className={styles.meta}>{meta}</span>}
    </div>
  );
}
