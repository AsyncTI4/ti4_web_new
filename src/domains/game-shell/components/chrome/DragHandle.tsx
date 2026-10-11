import { Box } from "@/ds";
import classes from "./DragHandle.module.css";

type DragHandleProps = {
  onMouseDown: (e: React.MouseEvent) => void;
  /** Double-click collapses or restores the rail. */
  onDoubleClick?: () => void;
  isDragging?: boolean;
};

/** Resize grip on the seam between the map and the seat dossier. */
export function DragHandle({ onMouseDown, onDoubleClick, isDragging }: DragHandleProps) {
  return (
    <Box
      className={classes.seam}
      data-dragging={isDragging || undefined}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize seat dossier (double-click to collapse)"
      title="Drag to resize · double-click to collapse"
    >
      <span className={classes.grip} />
    </Box>
  );
}
