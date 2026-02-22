import { Box } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import classes from "./PanelToggleButton.module.css";

type PanelToggleButtonProps = {
  isCollapsed: boolean;
  onClick: () => void;
  position: "left" | "right";
  style?: React.CSSProperties;
  className?: string;
};

export function PanelToggleButton({
  isCollapsed,
  onClick,
  position,
  style,
  className,
}: PanelToggleButtonProps) {
  const getToggleIcon = () => {
    if (position === "left") {
      return isCollapsed ? (
        <IconChevronRight size={16} className={classes.toggleIcon} />
      ) : (
        <IconChevronLeft size={16} className={classes.toggleIcon} />
      );
    } else {
      return isCollapsed ? (
        <IconChevronLeft size={16} className={classes.toggleIcon} />
      ) : (
        <IconChevronRight size={16} className={classes.toggleIcon} />
      );
    }
  };

  const baseClass =
    position === "left" ? classes.leftPanelToggle : classes.rightPanelToggle;

  return (
    <Box
      className={`${baseClass} ${isCollapsed ? classes.collapsed : ""} ${className || ""}`}
      onClick={onClick}
      style={style}
    >
      {getToggleIcon()}
    </Box>
  );
}
