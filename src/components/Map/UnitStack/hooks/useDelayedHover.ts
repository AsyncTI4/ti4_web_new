import { useRef, useCallback } from "react";

/**
 * Hook that manages delayed hover events with a timeout
 */
export function useDelayedHover(
  stackKey: string,
  onUnitMouseOver?: (stackKey: string, event: React.MouseEvent) => void,
  onUnitMouseLeave?: (stackKey: string, event: React.MouseEvent) => void
) {
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (!onUnitMouseOver) return;
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        onUnitMouseOver(stackKey, e);
        hoverTimeoutRef.current = null;
      }, 100);
    },
    [onUnitMouseOver, stackKey]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (onUnitMouseLeave) {
        onUnitMouseLeave(stackKey, e);
      }
    },
    [onUnitMouseLeave, stackKey]
  );

  return { handleMouseEnter, handleMouseLeave };
}

