import { useCallback, useState, useRef } from "react";

export type AreaType =
  | {
      type: "faction";
      faction: string;
      unitId?: string;
      coords: { x: number; y: number };
    }
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

  const selectedFaction =
    selectedArea?.type === "faction" ? selectedArea.faction : null;
  const activeUnit =
    activeArea?.type === "faction"
      ? {
          faction: activeArea.faction,
          unitId: activeArea.unitId,
          coords: activeArea.coords,
        }
      : null;

  // Optimized hover handlers - now include unit ID with delay
  const handleMouseEnter = useCallback(
    (faction: string, unitId: string, x: number, y: number) => {
      setActiveArea({ type: "faction", faction, unitId, coords: { x, y } });

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
    [selectedArea]
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

  // Add click handler for pinning areas
  const handleMouseDown = useCallback(
    (faction: string, x: number = 0, y: number = 0) => {
      setSelectedArea({ type: "faction", faction, coords: { x, y } });
    },
    []
  );

  // Unified area selection handler
  const handleAreaSelect = useCallback((area: AreaType) => {
    setSelectedArea(area);
    setActiveArea(null); // Clear any hover state
  }, []);

  const handleAreaMouseEnter = useCallback((area: AreaType) => {
    setActiveArea(area);
  }, []);

  const handleAreaMouseLeave = useCallback(() => {
    setActiveArea(null);
  }, []);

  return {
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
  };
}
