import { useState } from "react";
import type { Point } from "@/entities/data/types";

export type TooltipPlanet = {
  planetId: string;
  coords: Point;
};

export function useMapTooltips(
  handleMouseEnter: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void,
  handleMouseLeave: () => void
) {
  const [tooltipPlanet, setTooltipPlanet] = useState<TooltipPlanet | null>(null);

  const handlePlanetMouseEnter = (planetId: string, x: number, y: number) => {
    setTooltipPlanet({ planetId, coords: { x, y } });
  };

  const handlePlanetMouseLeave = () => {
    setTooltipPlanet(null);
  };

  const handleUnitMouseEnter = (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => {
    setTooltipPlanet(null);
    handleMouseEnter(faction, unitId, x, y);
  };

  return {
    tooltipPlanet,
    handlePlanetMouseEnter,
    handlePlanetMouseLeave,
    handleUnitMouseEnter,
    handleUnitMouseLeave: handleMouseLeave,
  };
}
