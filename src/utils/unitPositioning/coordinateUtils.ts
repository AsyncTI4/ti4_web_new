import { getPlanetById, getPlanetCoordsBySystemId } from "@/lookup/planets";
import {
  HEX_GRID_WIDTH,
  HEX_GRID_HEIGHT,
  DEFAULT_PLANET_RADIUS,
} from "./constants";
import { Planet, HeatSource } from "./types";

export const gridToPixel = (
  square: { row: number; col: number },
  squareWidth: number,
  squareHeight: number
): { x: number; y: number } => ({
  x: square.col * squareWidth + squareWidth / 2,
  y: square.row * squareHeight + squareHeight / 2,
});

export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getResourcesLocationAngle = (
  resourcesLocation: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight"
): number => {
  switch (resourcesLocation) {
    case "TopLeft":
      return (5 * Math.PI) / 4;
    case "TopRight":
      return (7 * Math.PI) / 4;
    case "BottomLeft":
      return (3 * Math.PI) / 4;
    case "BottomRight":
      return Math.PI / 4;
    default:
      return 0;
  }
};

export const parsePlanetsFromCoords = (systemId: string): Planet[] => {
  const planetCoords = getPlanetCoordsBySystemId(systemId);
  return Object.entries(planetCoords).map(([planetId, coordStr]) => {
    const planetData = getPlanetById(planetId);
    const [x, y] = coordStr.split(",").map(Number);
    return {
      name: planetId,
      x,
      y,
      radius: DEFAULT_PLANET_RADIUS,
      resourcesLocation: planetData?.planetLayout?.resourcesLocation,
    };
  });
};

export const getInitialHeatSourcesForSystem = (
  systemId: string
): HeatSource[] => {
  const initialHeatSources: HeatSource[] = [];
  if (systemId === "40" || systemId === "39" || systemId === "79") {
    initialHeatSources.push({
      x: HEX_GRID_WIDTH / 2,
      y: HEX_GRID_HEIGHT / 2,
      stackSize: 1,
    });
  }

  if (systemId === "25" || systemId === "26" || systemId === "64") {
    initialHeatSources.push({
      x: 200,
      y: 190,
      stackSize: 1,
    });
  }

  return initialHeatSources;
};
