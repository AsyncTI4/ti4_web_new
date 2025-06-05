import { Box } from "@mantine/core";
import { useMemo } from "react";
import classes from "./FactionCoordinateBoxes.module.css";

// Unit size dictionary mapping unit IDs to their hover box dimensions
const unitSizes: Record<string, { width: number; height: number }> = {
  // Ships
  dd: { width: 72, height: 72 }, // destroyer
  ff: { width: 70, height: 35 }, // fighter
  cv: { width: 70, height: 69 }, // carrier
  dn: { width: 77, height: 77 }, // dreadnought
  ca: { width: 67, height: 67 }, // cruiser
  ws: { width: 56, height: 65 }, // war sun
  fs: { width: 80, height: 82 }, // flagship

  // Ground units
  gf: { width: 70, height: 35 }, // ground forces
  mf: { width: 44, height: 45 }, // mech

  // Structures
  sd: { width: 42, height: 42 }, // space dock
  pd: { width: 33, height: 37 }, // pds

  // Default fallback
  default: { width: 30, height: 30 },
};

interface FactionCoordinateBoxesProps {
  factionCoordinates: any;
  onMouseEnter?: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void;
  onMouseLeave?: (faction: string) => void;
  onMouseDown?: (faction: string, unitId: string) => void;
  zoom: number;
  zoomFitToScreen: boolean;
}

const FactionCoordinateBoxes: React.FC<FactionCoordinateBoxesProps> = ({
  factionCoordinates,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
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
                    onMouseEnter={() => onMouseEnter?.(faction, unitId, x, y)}
                    onMouseLeave={() => onMouseLeave?.(faction)}
                    onMouseDown={() => onMouseDown?.(faction, unitId)}
                  />
                );
              });
            })
            .flat();
        }
        return [];
      })
      .flat();
  }, [
    factionCoordinates,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    zoom,
    zoomFitToScreen,
  ]);

  return <>{coordinateBoxes}</>;
};

export default FactionCoordinateBoxes;
