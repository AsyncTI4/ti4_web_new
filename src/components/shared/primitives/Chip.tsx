import { Box, Text, type BoxProps } from "@mantine/core";
import type { ColorKey } from "@/components/PlayerArea/gradientClasses";
import classes from "./Chip.module.css";
import cx from "clsx";

type Props = Omit<BoxProps, "color" | "onClick"> & {
  title?: string;
  leftSection?: React.ReactNode;
  children?: React.ReactNode;
  ribbon?: boolean;
  accentLine?: boolean;
  accent?: ColorKey | "grey" | "gray" | "deepRed";
  strong?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.KeyboardEventHandler<HTMLDivElement>;
};

export function Chip({
  title,
  leftSection,
  children,
  className,
  accent = "gray",
  ribbon = false,
  accentLine = false,
  strong = false,
  onClick,
  px,
  py,
  ...boxProps
}: Props) {
  const clickable = onClick !== undefined;
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!clickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <Box
      {...boxProps}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={cx(
        classes.chip,
        classes[accent ?? "gray"],
        clickable && classes.hover,
        clickable && classes.clickable,
        ribbon && classes.ribbon,
        accentLine && classes.accentLine,
        strong && classes.strong,
        className
      )}
    >
      <Box className={classes.inner} px={px} py={py}>
        {leftSection && (
          <Box className={classes.leftSection}>{leftSection}</Box>
        )}
        {title && (
          <Text size="xs" fw={700} c="white" className={classes.textContainer}>
            {title}
          </Text>
        )}
        {children}
      </Box>
    </Box>
  );
}
