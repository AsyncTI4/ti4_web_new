import { useId } from "react";
import { useFactionColors } from "@/hooks/useFactionColors";
import {
  generateHexagonPoints,
  generateHexagonSides,
  HEX_SIDE_TO_TILE_DIRECTION,
} from "@/entities/geometry/hexagonUtils";
import { TILE_HEIGHT, TILE_WIDTH } from "@/entities/geometry/tilePositioning";
import classes from "./MapTile.module.css";
import { resolvePrimaryRgb, toRgb } from "@/entities/lookup/colors";
import { normalizeBorderColor } from "@/entities/game/colorOptimization";

type Props = {
  faction: string;
  openSides?: number[];
};

const centerX = TILE_WIDTH / 2;
const centerY = TILE_HEIGHT / 2;
const HEX_POINTS = generateHexagonPoints(centerX, centerY, TILE_WIDTH / 2);
const HEX_POINTS_STRING = HEX_POINTS.map((point) => `${point.x},${point.y}`).join(" ");
const HEX_SIDES = generateHexagonSides(HEX_POINTS);
const BORDER_STROKE_WIDTH = 8;
const BORDER_INSET = 2.5;

export function FactionControlBorderOverlay({ faction, openSides }: Props) {
  const factionColorMap = useFactionColors();
  const clipId = useId();
  const baseColor = factionColorMap?.[faction]?.color;

  const openSet = new Set(openSides);
  const closedSides = [0, 1, 2, 3, 4, 5].filter(
    (sideIndex) => !openSet.has(HEX_SIDE_TO_TILE_DIRECTION[sideIndex])
  );

  if (!baseColor || closedSides.length === 0) return null;

  const primary = resolvePrimaryRgb(baseColor);
  if (!primary) return null;

  const stroke = toRgb(normalizeBorderColor(primary));

  return (
    <svg
      className={classes.controlBorderOverlay}
      style={{ width: TILE_WIDTH, height: TILE_HEIGHT }}
      viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={HEX_POINTS_STRING} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {closedSides.map((sideIndex) => {
          const side = HEX_SIDES[sideIndex];
          const midX = (side.x1 + side.x2) / 2;
          const midY = (side.y1 + side.y2) / 2;
          const toCenterX = centerX - midX;
          const toCenterY = centerY - midY;
          const edgeX = side.x2 - side.x1;
          const edgeY = side.y2 - side.y1;
          const edgeLen = Math.hypot(edgeX, edgeY) || 1;
          const normalX = -edgeY / edgeLen;
          const normalY = edgeX / edgeLen;
          const dot = normalX * toCenterX + normalY * toCenterY;
          const insetDir = dot >= 0 ? 1 : -1;
          const insetX = normalX * BORDER_INSET * insetDir;
          const insetY = normalY * BORDER_INSET * insetDir;
          return (
            <line
              key={`control-border-${faction}-${sideIndex}`}
              x1={side.x1 + insetX}
              y1={side.y1 + insetY}
              x2={side.x2 + insetX}
              y2={side.y2 + insetY}
              stroke={stroke}
              strokeWidth={BORDER_STROKE_WIDTH}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
}
