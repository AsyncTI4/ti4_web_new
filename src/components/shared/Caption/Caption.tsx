import { Text, TextProps } from "@mantine/core";
import cx from "clsx";
import styles from "./Caption.module.css";

type CaptionSize = "xs" | "sm" | "md";

type Props = Omit<TextProps, "size"> & {
  children: React.ReactNode;
  size?: CaptionSize;
  uppercase?: boolean;
};

export function Caption({
  children,
  size = "xs",
  uppercase = true,
  className,
  ...textProps
}: Props) {
  return (
    <Text
      c="gray.4"
      className={cx(styles.caption, styles[size], className)}
      {...textProps}
    >
      {uppercase ? String(children).toUpperCase() : children}
    </Text>
  );
}

export default Caption;
