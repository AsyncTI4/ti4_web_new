import { useCallback, useState, useRef, useMemo } from "react";

export type AreaType =
  | {
      type: "faction";
      faction: string;
      unitId?: string;
      coords: { x: number; y: number };
    }
  | { type: "tech" }
  | { type: "components" }
  | { type: "strength" }
  | null;

export function useTabsAndTooltips() {
  const [selectedArea, setSelectedArea] = useState<AreaType>(null);
  const [activeArea, setActiveArea] = useState<AreaType>(null);
  const [tooltipUnit, setTooltipUnit] = useState<{
    faction: string;
    unitId?: string;
    coords: { x: number; y: number };
  } | null>(null);

  // Use ref for hover timeout instead of state
  const hoverTimeoutRef = useRef<number | null>(null);

  // Memoize derived values to prevent unnecessary recalculations
  const selectedFaction = useMemo(
    () => (selectedArea?.type === "faction" ? selectedArea.faction : null),
    [selectedArea]
  );

  const activeUnit = useMemo(
    () =>
      activeArea?.type === "faction"
        ? {
            faction: activeArea.faction,
            unitId: activeArea.unitId,
            coords: activeArea.coords,
          }
        : null,
    [activeArea]
  );

  // Optimized hover handlers - memoized with stable dependencies
  const handleMouseEnter = useCallback(
    (faction: string, unitId: string, x: number, y: number) => {
      // Create the new area object once
      const newArea = { type: "faction" as const, faction, unitId, coords: { x, y } };
      setActiveArea(newArea);

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set a new timeout for 300ms delay for map tooltip
      const newTimeout = setTimeout(() => {
        setTooltipUnit({ faction, unitId, coords: { x, y } });
        hoverTimeoutRef.current = null;
      }, 300);

      hoverTimeoutRef.current = newTimeout;
    },
    [] // No dependencies needed since we're not referencing any external state
  );

  const handleMouseLeave = useCallback(() => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Immediately clear both states
    setActiveArea(null);
    setTooltipUnit(null);
  }, []);

  // Add click handler for pinning areas - memoized with stable implementation
  const handleMouseDown = useCallback(
    (faction: string, x: number = 0, y: number = 0) => {
      setSelectedArea({ type: "faction", faction, coords: { x, y } });
    },
    []
  );

  // Unified area selection handler - memoized
  const handleAreaSelect = useCallback((area: AreaType) => {
    setSelectedArea(area);
    setActiveArea(null); // Clear any hover state
  }, []);

  // Memoized area hover handlers
  const handleAreaMouseEnter = useCallback((area: AreaType) => {
    setActiveArea(area);
  }, []);

  const handleAreaMouseLeave = useCallback(() => {
    setActiveArea(null);
  }, []);

  // Return memoized object to prevent unnecessary re-renders in consuming components
  return useMemo(
    () => ({
      selectedArea,
      activeArea,
      selectedFaction,
      activeUnit,
      tooltipUnit,

      handleAreaSelect,
      handleAreaMouseEnter,
      handleAreaMouseLeave,

      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
    }),
    [
      selectedArea,
      activeArea,
      selectedFaction,
      activeUnit,
      tooltipUnit,
      handleAreaSelect,
      handleAreaMouseEnter,
      handleAreaMouseLeave,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
    ]
  );
}