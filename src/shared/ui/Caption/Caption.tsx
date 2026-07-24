import { Text, TextProps } from "@mantine/core";
import cx from "clsx";
import styles from "./Caption.module.css";

type CaptionSize = "xs" | "sm" | "md";

type Props = Omit<TextProps, "size"> & {
  children: React.ReactNode;
  size?: CaptionSize;
  uppercase?: boolean;
  /** Extend a fading hairline after the label, schematic-callout style */
  rule?: boolean;
};

export function Caption({
  children,
  size = "xs",
  uppercase = true,
  rule = false,
  className,
  ...textProps
}: Props) {
  const label = (
    <Text
      c="gray.4"
      className={cx(styles.caption, styles[size], className)}
      {...textProps}
    >
      {uppercase && typeof children === "string"
        ? children.toUpperCase()
        : children}
    </Text>
  );

  if (!rule) return label;

  return (
    <span className={styles.ruleRow}>
      {label}
      <span className={styles.rule} />
    </span>
  );
}

export default Caption;
