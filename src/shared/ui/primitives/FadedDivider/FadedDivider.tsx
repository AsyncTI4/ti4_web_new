import React from "react";
import styles from "./FadedDivider.module.css";

type Props = {
  orientation?: "vertical" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
};

export default function FadedDivider({
  orientation = "vertical",
  className,
  style,
}: Props) {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={`${styles.wrapper} ${isVertical ? styles.vertical : styles.horizontal} ${className || ""}`}
      style={style}
      aria-hidden
    >
      <div className={styles.line} />
    </div>
  );
}
