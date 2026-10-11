import { UnstyledButton } from "@/ds";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import cx from "clsx";
import classes from "./PanelToggleButton.module.css";

type PanelToggleButtonProps = {
  isCollapsed: boolean;
  onClick: () => void;
  position: "left" | "right";
  style?: React.CSSProperties;
  className?: string;
};

/** A tab on a rail's inner edge that collapses or restores the rail. */
export function PanelToggleButton({
  isCollapsed,
  onClick,
  position,
  style,
  className,
}: PanelToggleButtonProps) {
  const pointsRight = (position === "left") === isCollapsed;
  const ToggleIcon = pointsRight ? IconChevronRight : IconChevronLeft;
  const rail = position === "left" ? "table rail" : "seat dossier";
  const shortcut = position === "left" ? "L" : "R";

  return (
    <UnstyledButton
      className={cx(classes.toggle, isCollapsed && classes.collapsed, className)}
      data-side={position}
      onClick={onClick}
      style={style}
      aria-label={`${isCollapsed ? "Show" : "Hide"} ${rail}`}
      aria-expanded={!isCollapsed}
      title={`${isCollapsed ? "Show" : "Hide"} ${rail} (${shortcut})`}
    >
      <ToggleIcon size={14} stroke={2} />
    </UnstyledButton>
  );
}
