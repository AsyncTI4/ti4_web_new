import { useCallback, useState } from "react";

type TooltipPlanet = {
  planetId: string;
  coords: { x: number; y: number };
} | null;

export function useMapTooltips(
  handleMouseEnter: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void,
  handleMouseLeave: () => void
) {
  const [tooltipPlanet, setTooltipPlanet] = useState<TooltipPlanet>(null);

  const handlePlanetMouseEnter = useCallback(
    (planetId: string, x: number, y: number) => {
      setTooltipPlanet({ planetId, coords: { x, y } });
    },
    []
  );

  const handlePlanetMouseLeave = useCallback(() => {
    setTooltipPlanet(null);
  }, []);

  const handleUnitMouseEnter = useCallback(
    (faction: string, unitId: string, x: number, y: number) => {
      setTooltipPlanet(null);
      handleMouseEnter(faction, unitId, x, y);
    },
    [handleMouseEnter]
  );

  const handleUnitMouseLeave = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  return {
    tooltipPlanet,
    handlePlanetMouseEnter,
    handlePlanetMouseLeave,
    handleUnitMouseEnter,
    handleUnitMouseLeave,
  };
}
