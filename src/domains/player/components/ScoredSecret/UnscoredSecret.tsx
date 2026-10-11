import { ObjectGlyph } from "@/domains/player/components/silhouettes/ObjectShell";
import objectStyles from "@/domains/player/components/silhouettes/Object.module.css";
import cx from "clsx";
import styles from "./ScoredSecret.module.css";

/** A sealed secret: the folder is held, its contents redacted. */
export function UnscoredSecret() {
  return (
    <div
      className={cx(objectStyles.obj, styles.secret)}
      data-s="sealed"
      title="Unscored secret"
      aria-label="Unscored secret"
      role="img"
    >
      <ObjectGlyph src="/so_icon.png" />
      <span className={styles.redact} />
    </div>
  );
}
