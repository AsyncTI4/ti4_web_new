import { Box, type BoxProps } from "@/ds";
import cx from "clsx";
import classes from "./Panel.module.css";

type Props = BoxProps & {
  noPadding?: boolean;
  children: React.ReactNode;
};

/** Panel - A subtle container for grouping related content. */
export function Panel({ noPadding = false, className, children, ...boxProps }: Props) {
  return (
    <Box
      className={cx(classes.panel, noPadding && classes.noPadding, className)}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
