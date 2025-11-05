import { cdnImage } from "@/data/cdnImage";
import { MapTileType, BorderAnomalyInfo } from "@/data/types";
import classes from "./BorderAnomalyLayer.module.css";

type Props = {
  mapTile: MapTileType;
};

const DIRECTION_TO_SIDE_MAP: Record<number, number> = {
  0: 4, // N -> side 4
  1: 5, // NE -> side 5
  2: 0, // SE -> side 0
  3: 1, // S -> side 1
  4: 2, // SW -> side 2
  5: 3, // NW -> side 3
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

function getRotationForSide(
  hexOutline: MapTileType["properties"]["hexOutline"],
  sideIndex: number
): number {
  const side = hexOutline.sides[sideIndex];
  if (!side) return 0;

  const dx = side.x2 - side.x1;
  const dy = side.y2 - side.y1;
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  return angleDeg;
}

export function BorderAnomalyLayer({ mapTile }: Props) {
  const borderAnomalies = mapTile.borderAnomalies;

  if (!borderAnomalies || borderAnomalies.length === 0) {
    return null;
  }

  const hexOutline = mapTile.properties.hexOutline;
  if (!hexOutline.midpoints || hexOutline.midpoints.length < 6) {
    return null;
  }

  return (
    <>
      {borderAnomalies.map((anomaly: BorderAnomalyInfo, index: number) => {
        const sideIndex = DIRECTION_TO_SIDE_MAP[anomaly.direction];
        if (sideIndex === undefined) {
          console.warn(
            `Invalid direction ${anomaly.direction} for border anomaly`
          );
          return null;
        }

        const midpoint = hexOutline.midpoints![sideIndex];
        const rotation = getRotationForSide(hexOutline, sideIndex);
        const imagePath = getBorderAnomalyImagePath(anomaly.type);

        const relativeX = midpoint.x - mapTile.properties.x;
        const relativeY = midpoint.y - mapTile.properties.y;

        return (
          <img
            key={`border-anomaly-${mapTile.position}-${anomaly.direction}-${index}`}
            src={cdnImage(imagePath)}
            alt={`${anomaly.type} border anomaly`}
            className={classes.borderAnomaly}
            style={{
              position: "absolute",
              left: `${relativeX}px`,
              top: `${relativeY}px`,
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
