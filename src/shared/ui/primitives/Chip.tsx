import { Box, Text, type BoxProps } from "@mantine/core";
import type { ColorKey } from "@/domains/player/components/gradientClasses";
import classes from "./Chip.module.css";
import cx from "clsx";

type ChipSize = "xs" | "sm" | "md";

type ChipAccent =
  | ColorKey
  | "grey"
  | "gray"
  | "deepRed"
  | "bloodOrange"
  | "blueRed"
  | "blueGreen"
  | "blueYellow"
  | "greenRed"
  | "greenYellow"
  | "yellowRed";

type Props = Omit<BoxProps, "color" | "onClick"> & {
  title?: string;
  leftSection?: React.ReactNode;
  children?: React.ReactNode;
  ribbon?: boolean;
  accentLine?: boolean;
  accent?: ChipAccent;
  strong?: boolean;
  breakthrough?: boolean;
  size?: ChipSize;
  /** When true, shows an absolute-positioned full title on hover */
  revealFullTitleOnHover?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.KeyboardEventHandler<HTMLDivElement>;
};

const TEXT_SIZES: Record<ChipSize, string> = {
  xs: "10px",
  sm: "xs",
  md: "xs",
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
  breakthrough = false,
  size = "md",
  revealFullTitleOnHover = false,
  onClick,
  px,
  py,
  ...boxProps
}: Props) {
  const textSize = TEXT_SIZES[size];
  const clickable = onClick !== undefined;
  const HYBRID_ACCENTS = [
    "blueRed",
    "blueGreen",
    "blueYellow",
    "greenRed",
    "greenYellow",
    "yellowRed",
  ] as const;
  const isHybrid = HYBRID_ACCENTS.includes(
    accent as (typeof HYBRID_ACCENTS)[number]
  );
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
        classes[`size_${size}`],
        breakthrough && classes.breakthrough,
        clickable && classes.hover,
        clickable && classes.clickable,
        ribbon && classes.ribbon,
        accentLine && classes.accentLine,
        strong && classes.strong,
        className
      )}
      data-split={isHybrid ? "true" : undefined}
    >
      {isHybrid && (
        <>
          <div className={classes.halfLeft} />
          <div className={classes.halfRight} />
        </>
      )}
      <Box
        className={cx(
          classes.inner,
          revealFullTitleOnHover && classes.revealFullTitle
        )}
        px={px}
        py={py}
      >
        {leftSection && (
          <Box className={classes.leftSection}>{leftSection}</Box>
        )}
        {title && (
          <Text size={textSize} fw={700} c="white" className={classes.textContainer}>
            {title}
          </Text>
        )}
        {title && revealFullTitleOnHover && (
          <Text size={textSize} fw={700} c="white" className={classes.fullTitle}>
            {title}
          </Text>
        )}
        {children}
      </Box>
    </Box>
  );
}
