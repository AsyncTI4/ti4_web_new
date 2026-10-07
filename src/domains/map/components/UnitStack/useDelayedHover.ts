import { useRef } from "react";

const HOVER_DELAY_MS = 100;

/** Delays the hover callback so sweeping the cursor across stacks doesn't flash tooltips. */
export function useDelayedHover(
  stackKey: string,
  onUnitMouseOver?: (stackKey: string, event: React.MouseEvent) => void,
  onUnitMouseLeave?: (stackKey: string, event: React.MouseEvent) => void
) {
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!onUnitMouseOver) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      onUnitMouseOver(stackKey, e);
      hoverTimeoutRef.current = null;
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    onUnitMouseLeave?.(stackKey, e);
  };

  return { handleMouseEnter, handleMouseLeave };
}
