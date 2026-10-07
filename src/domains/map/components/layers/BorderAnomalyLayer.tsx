import { cdnImage } from "@/entities/data/cdnImage";
import type { Tile } from "@/entities/game/types";
import { HEXAGON_EDGE_MIDPOINTS } from "@/entities/geometry/tilePositioning";
import classes from "./BorderAnomalyLayer.module.css";

type Props = {
  mapTile: Tile;
};

const BORDER_IMAGES: Record<string, string> = {
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

function getBorderAnomalyImagePath(type: string): string {
  return BORDER_IMAGES[type.toLowerCase()] || "/borders/void_tether.png";
}

export function BorderAnomalyLayer({ mapTile }: Props) {
  const borderAnomalies = mapTile.borderAnomalies;

  if (!borderAnomalies?.length) return null;

  return (
    <>
      {borderAnomalies.map((anomaly, index) => {
        const direction = anomaly.direction;
        if (direction < 0 || direction > 5) return null;

        // Directions run clockwise from N: 0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW.
        const midpoint = HEXAGON_EDGE_MIDPOINTS[direction];
        const rotation = direction * 60;
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
