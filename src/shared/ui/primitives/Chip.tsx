import { Box, Text, type BoxProps } from "@/ds";
import classes from "./Chip.module.css";
import cx from "clsx";

type ChipSize = "xs" | "md";

type ChipAccent = "red" | "blue" | "green" | "purple" | "orange" | "gray";

type Props = Omit<BoxProps, "color" | "onClick"> & {
  title?: string;
  children?: React.ReactNode;
  accent?: ChipAccent;
  strong?: boolean;
  size?: ChipSize;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
};

const TEXT_SIZES: Record<ChipSize, string> = {
  xs: "10px",
  md: "xs",
};

export function Chip({
  title,
  children,
  className,
  accent = "gray",
  strong = false,
  size = "md",
  onClick,
  px,
  py,
  ...boxProps
}: Props) {
  const textSize = TEXT_SIZES[size];
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
        classes[accent],
        size === "xs" && classes.size_xs,
        clickable && classes.clickable,
        strong && classes.strong,
        className
      )}
    >
      <Box className={classes.inner} px={px} py={py}>
        {title && (
          <Text
            size={textSize}
            /* Semibold, not bold. Set here rather than in CSS because the fw
               prop emits an inline style that overrides the class. */
            fw={600}
            c="white"
            className={classes.textContainer}
            /* Native tooltip so a name the plate is too narrow to show can still
               be read without opening the details popover. */
            title={title}
          >
            {title}
          </Text>
        )}
        {children}
      </Box>
    </Box>
  );
}
