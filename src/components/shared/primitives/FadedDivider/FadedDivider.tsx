import React from "react";
import styles from "./FadedDivider.module.css";

type Props = {
  orientation?: "vertical" | "horizontal";
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
  mx?: number;
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
