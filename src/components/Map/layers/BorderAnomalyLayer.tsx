import { cdnImage } from "@/data/cdnImage";
import { BorderAnomalyInfo } from "@/data/types";
import { Tile } from "@/context/types";
import { HEXAGON_EDGE_MIDPOINTS } from "@/mapgen/tilePositioning";
import classes from "./BorderAnomalyLayer.module.css";

type Props = {
  mapTile: Tile;
};

function getBorderAnomalyImagePath(type: string): string {
  const imageMap: Record<string, string> = {
    void_tether: "/borders/void_tether.png",
    spatial_tear: "/borders/spatial_tear_border.png",
    asteroid: "/borders/asteroid_border.png",
    gravity_wave: "/borders/gravity_wave_border.png",
    nebula: "/borders/nebula_border.png",
    minefield: "/borders/minefield_border.png",
    core_border: "/borders/core_border.png",
    rim_border: "/borders/rim_border.png",
    yellow: "/borders/yellow.png",
    redorange: "/borders/redorange.png",
  };

  return imageMap[type.toLowerCase()] || "/borders/void_tether.png";
}

// Rotation angles for each direction (0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW)
const DIRECTION_ROTATION: Record<number, number> = {
  0: 0, // N - horizontal edge at top
  1: 60, // NE
  2: 120, // SE
  3: 180, // S - horizontal edge at bottom (or 0, same visual)
  4: 240, // SW (or -120)
  5: 300, // NW (or -60)
};

export function BorderAnomalyLayer({ mapTile }: Props) {
  const borderAnomalies = mapTile.borderAnomalies;

  if (!borderAnomalies || borderAnomalies.length === 0) {
    return null;
  }

  return (
    <>
      {borderAnomalies.map((anomaly: BorderAnomalyInfo, index: number) => {
        const direction = anomaly.direction;
        if (direction < 0 || direction > 5) {
          console.warn(
            `Invalid direction ${direction} for border anomaly`
          );
          return null;
        }

        // Use pre-calculated tile-relative midpoints
        // HEXAGON_EDGE_MIDPOINTS indices match API directions: 0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW
        const midpoint = HEXAGON_EDGE_MIDPOINTS[direction];
        const rotation = DIRECTION_ROTATION[direction];
        const imagePath = getBorderAnomalyImagePath(anomaly.type);

        return (
          <img
            key={`border-anomaly-${mapTile.position}-${anomaly.direction}-${index}`}
            src={cdnImage(imagePath)}
            alt={`${anomaly.type} border anomaly`}
            className={classes.borderAnomaly}
            style={{
              position: "absolute",
              left: `${midpoint.x}px`,
              top: `${midpoint.y}px`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              pointerEvents: "none",
              zIndex: 100,
            }}
          />
        );
      })}
    </>
  );
}
