import { Text } from "@mantine/core";
import styles from "./Caption.module.css";

type Props = {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md";
  uppercase?: boolean;
  className?: string;
};

export function Caption({
  children,
  size = "xs",
  uppercase = true,
  className,
}: Props) {
  const sizeMap: Record<string, string> = {
    xs: styles.xs,
    sm: styles.sm,
    md: styles.md,
  };

  return (
    <Text
      c="gray.4"
      className={`${styles.caption} ${sizeMap[size]} ${className || ""}`}
      fw={600}
    >
      {uppercase ? String(children).toUpperCase() : children}
    </Text>
  );
}

export default Caption;
