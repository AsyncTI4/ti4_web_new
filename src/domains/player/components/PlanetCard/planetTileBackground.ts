import type { CSSProperties } from "react";
import { getTileById } from "@/domains/map/model/mapgen/systems";
import { cdnImage } from "@/entities/data/cdnImage";
import type { Planet } from "@/entities/data/types";

const TILE_ART_WIDTH = 345;
const TILE_ART_HEIGHT = 299;
const FOCAL_Y_PERCENT = 26;

export function getPlanetTileBackground(planetData: Planet) {
  if (!planetData.tileId) return null;

  const tile = getTileById(planetData.tileId);
  const center =
    planetData.planetLayout?.centerPosition ?? planetData.positionInTile;

  if (!tile || !center) return null;

  const planetRadius = planetData.planetLayout?.planetRadius ?? 0;
  const focusRadius = Math.max(
    26,
    Math.min(54, (planetRadius || 52) * 0.78)
  );
  const focusFade = Math.max(18, focusRadius * 0.55);
  const focusMid = focusRadius + focusFade * 0.55;
  const focusOuter = focusRadius + focusFade;

  return {
    src: cdnImage(`/tiles/${tile.imagePath}`),
    imageStyle: {
      width: TILE_ART_WIDTH,
      height: TILE_ART_HEIGHT,
      left: `calc(50% - ${center.x}px)`,
      top: `calc(${FOCAL_Y_PERCENT}% - ${center.y}px)`,
    } as CSSProperties,
    maskStyle: {
      "--planet-focus-y": `${FOCAL_Y_PERCENT}%`,
      "--planet-focus-radius": `${focusRadius}px`,
      "--planet-focus-mid": `${focusMid}px`,
      "--planet-focus-outer": `${focusOuter}px`,
    } as CSSProperties,
  };
}
