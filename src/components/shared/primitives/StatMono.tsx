import { Text, type TextProps } from "@mantine/core";
import classes from "./Hierarchy.module.css";

type Props = TextProps & {
  children: React.ReactNode;
};

export function StatMono({ children, className, ...textProps }: Props) {
  return (
    <Text {...textProps} className={`${classes.monoValue} ${className || ""}`}>
      {children}
    </Text>
  );
}


