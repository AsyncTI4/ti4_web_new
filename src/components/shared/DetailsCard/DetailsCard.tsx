import { Stack, Box, BoxProps } from "@mantine/core";
import { ReactNode } from "react";
import classes from "./DetailsCard.module.css";

type Props = {
  children: ReactNode;
  width?: number;
  color?:
    | "none"
    | "yellow"
    | "purple"
    | "red"
    | "orange"
    | "cyan"
    | "blue"
    | "green";
} & Omit<BoxProps, "children" | "w">;

export function DetailsCard({
  children,
  width,
  color = "none",
  ...boxProps
}: Props) {
  const { className, ...restBoxProps } = boxProps;
  const getCardClass = () => {
    if (color === "yellow") return `${classes.card} ${classes.yellow}`;
    if (color === "purple") return `${classes.card} ${classes.purple}`;
    if (color === "red") return `${classes.card} ${classes.red}`;
    if (color === "orange") return `${classes.card} ${classes.orange}`;
    if (color === "cyan") return `${classes.card} ${classes.cyan}`;
    if (color === "green") return `${classes.card} ${classes.green}`;
    if (color === "blue") return `${classes.card}`;
    return classes.card;
  };

  return (
    <Box
      w={width}
      p="md"
      className={`${getCardClass()}${className ? ` ${className}` : ""}`}
      {...restBoxProps}
    >
      <Stack gap="sm">{children}</Stack>
    </Box>
  );
}
