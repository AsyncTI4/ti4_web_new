import { Stack, Box, BoxProps } from "@mantine/core";
import { ReactNode } from "react";
import cx from "clsx";
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
  className,
  ...boxProps
}: Props) {
  return (
    <Box
      w={width}
      maw="calc(100vw - 16px)"
      p="md"
      className={cx(classes.card, color !== "none" && classes[color], className)}
      {...boxProps}
    >
      <Stack gap="sm">{children}</Stack>
    </Box>
  );
}
