import { Box, type BoxProps } from "@mantine/core";
import type { ColorKey } from "@/components/PlayerArea/gradientClasses";
import classes from "./Hierarchy.module.css";

type Props = Omit<BoxProps, "color" | "onClick"> & {
  children: React.ReactNode;
  enableHover?: boolean;  
  accent?: ColorKey | "grey" | "gray";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

function getHoverOutlineClass(accent?: Props["accent"]) {
  switch (accent) {
    case "yellow":
      return classes.hoverOutlineYellow;
    case "cyan":
      return classes.hoverOutlineCyan;
    case "red":
      return classes.hoverOutlineRed;
    case "blue":
      return classes.hoverOutlineBlue;
    case "green":
      return classes.hoverOutlineGreen;
    case "purple":
      return classes.hoverOutlinePurple;
    case "grey":
    case "gray":
    default:
      return classes.hoverOutlineGray;
  }
}

export function Chip({
  children,
  className,
  accent = "gray",
  enableHover = true,
  onClick,
  ...boxProps
}: Props) {
  const clickable = typeof onClick === "function";
  const hoverClass = getHoverOutlineClass(accent);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!clickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(
        event as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
      );
    }
  };

  return (
    <Box
      {...boxProps}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={`${classes.chip} ${classes.chipOutline} ${enableHover ? classes.chipGlowHover : ""} ${clickable ? classes.chipClickable : ""} ${enableHover ? classes.hoverOutline : ""} ${enableHover ? hoverClass : ""} ${className || ""}`}
      style={{
        cursor: clickable ? "pointer" : undefined,
        ...boxProps.style,
      }}
    >
      {children}
    </Box>
  );
}