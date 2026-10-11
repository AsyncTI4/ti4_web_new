import cx from "clsx";
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from "react";
import styles from "./Object.module.css";

type Props = {
  className?: string;
  /** Silhouette state hook for CSS: exhausted, locked, unscored, sealed… */
  state?: string;
  label: string;
  onClick?: () => void;
  style?: CSSProperties;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/**
 * The interactive frame every named game object sits in. It owns only what all
 * silhouettes share — row height, label type, focus ring, keyboard activation —
 * and leaves the shape itself to the object's own class.
 */
export function ObjectShell({
  className,
  state,
  label,
  onClick,
  style,
  children,
  ref,
}: Props) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick();
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      title={label}
      aria-label={label}
      data-s={state}
      className={cx(styles.obj, className)}
      style={style}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/** The object's name, truncated with an ellipsis inside its silhouette. */
export function ObjectLabel({ children }: { children: ReactNode }) {
  return <span className={styles.t}>{children}</span>;
}

/** A 15px image glyph seated before the name. */
export function ObjectGlyph({
  src,
  size,
  className,
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cx(styles.g, className)}
      style={
        {
          backgroundImage: src ? `url("${src}")` : undefined,
          ...(size ? { width: size, height: size } : {}),
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}
