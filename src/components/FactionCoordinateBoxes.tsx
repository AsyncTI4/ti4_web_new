import { Box } from "@mantine/core";
import { useMemo } from "react";
import classes from "./FactionCoordinateBoxes.module.css";

// Unit size dictionary mapping unit IDs to their hover box dimensions
const unitSizes: Record<string, { width: number; height: number }> = {
  // Ships
  dd: { width: 30, height: 30 }, // destroyer
  ff: { width: 25, height: 25 }, // fighter
  cv: { width: 35, height: 35 }, // carrier
  dn: { width: 40, height: 40 }, // dreadnought
  cr: { width: 32, height: 32 }, // cruiser
  ws: { width: 50, height: 50 }, // war sun
  fs: { width: 45, height: 45 }, // flagship

  // Ground units
  gf: { width: 25, height: 25 }, // ground forces
  mf: { width: 28, height: 28 }, // mech
  inf: { width: 25, height: 25 }, // infantry

  // Structures
  sd: { width: 40, height: 40 }, // space dock
  pd: { width: 35, height: 35 }, // pds

  // Default fallback
  default: { width: 30, height: 30 },
};

interface FactionHandlers {
  [faction: string]: {
    onMouseEnter: () => void;
    onClick: () => void;
    onMouseLeave: () => void;
  };
}

interface FactionCoordinateBoxesProps {
  factionCoordinates: any;
  factionHandlers: FactionHandlers;
  zoom: number;
  zoomFitToScreen: boolean;
}

const FactionCoordinateBoxes: React.FC<FactionCoordinateBoxesProps> = ({
  factionCoordinates,
  factionHandlers,
  zoom,
  zoomFitToScreen,
}) => {
  const coordinateBoxes = useMemo(() => {
    if (!factionCoordinates) return [];

    return Object.entries(factionCoordinates)
      .map(([faction, unitData]) => {
        if (typeof unitData === "object" && unitData !== null) {
          return Object.entries(unitData)
            .map(([unitId, coordinateArray]) => {
              const coords = Array.isArray(coordinateArray)
                ? coordinateArray
                : [];
              return coords.map((coordString: string, index: number) => {
                const [x, y] = coordString.split(",").map(Number);
                const unitSize = unitSizes[unitId] || unitSizes.default;
                const scaledWidth =
                  unitSize.width * (zoomFitToScreen ? 1 : zoom);
                const scaledHeight =
                  unitSize.height * (zoomFitToScreen ? 1 : zoom);

                return (
                  <Box
                    key={`${faction}-${unitId}-${index}`}
                    className={classes.coordinateBox}
                    style={{
                      left: `${x * (zoomFitToScreen ? 1 : zoom)}px`,
                      top: `${y * (zoomFitToScreen ? 1 : zoom)}px`,
                      width: `${scaledWidth}px`,
                      height: `${scaledHeight}px`,
                    }}
                    {...factionHandlers[faction]}
                  />
                );
              });
            })
            .flat();
        }
        return [];
      })
      .flat();
  }, [factionCoordinates, factionHandlers, zoom, zoomFitToScreen]);

  return <>{coordinateBoxes}</>;
};

export default FactionCoordinateBoxes;
