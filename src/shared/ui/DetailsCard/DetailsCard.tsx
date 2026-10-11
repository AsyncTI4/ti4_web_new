import { Box, type BoxProps } from "@/ds";
import type { ReactNode } from "react";
import cx from "clsx";
import classes from "./DetailsCard.module.css";

export type DetailsCardColor =
  | "none"
  | "yellow"
  | "purple"
  | "violet"
  | "red"
  | "orange"
  | "cyan"
  | "blue"
  | "green"
  | "gold"
  | "teal"
  | "sky";

type Props = {
  children: ReactNode;
  width?: number;
  /** The object's signal colour; it tints the type line, labels and tile. */
  color?: DetailsCardColor;
} & Omit<BoxProps, "children" | "w" | "color">;

/**
 * The floating dossier behind every object popover. Compose it from
 * `DetailsCard.Title` (header with icon tile), `DetailsCard.Section` and
 * `DetailsCard.Flavor`; any other child is padded as a section.
 */
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
      className={cx(classes.card, color !== "none" && classes[color], className)}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
