import { useId, useMemo } from "react";
import { useFactionColors } from "@/hooks/useFactionColors";
import {
  generateHexagonPoints,
  generateHexagonSides,
  HEX_SIDE_TO_TILE_DIRECTION,
} from "@/utils/hexagonUtils";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import classes from "./MapTile.module.css";
import { findColorData, getColorValues } from "@/lookup/colors";
import { normalizeBorderColor } from "@/utils/colorOptimization";

type Props = {
  faction: string;
  openSides?: number[];
  opacity?: number;
};

const radius = TILE_WIDTH / 2;
const centerX = TILE_WIDTH / 2;
const centerY = TILE_HEIGHT / 2;
const BORDER_STROKE_WIDTH = 8;
const BORDER_INSET = 2.5;

export function FactionControlBorderOverlay({
  faction,
  openSides,
  opacity = 1,
}: Props) {
  const factionColorMap = useFactionColors();
  const baseColor = factionColorMap?.[faction]?.color;

  const closedSides = useMemo(() => {
    if (!openSides || openSides.length === 0) {
      return [0, 1, 2, 3, 4, 5];
    }
    const openSet = new Set(openSides);
    return [0, 1, 2, 3, 4, 5].filter(
      (sideIndex) => !openSet.has(HEX_SIDE_TO_TILE_DIRECTION[sideIndex])
    );
  }, [openSides]);

  if (!baseColor || closedSides.length === 0) return null;

  const points = generateHexagonPoints(centerX, centerY, radius);
  const pointsString = points.map((point) => `${point.x},${point.y}`).join(" ");
  const sides = generateHexagonSides(points);

  const colorData = baseColor ? findColorData(baseColor) : undefined;
  const primary = colorData
    ? getColorValues(colorData.primaryColorRef, colorData.primaryColor)
    : undefined;

  if (!primary) return null;

  const normalized = normalizeBorderColor(primary);
  const stroke = `rgba(${normalized.red}, ${normalized.green}, ${normalized.blue}, ${opacity})`;
  const clipId = useId();

  return (
    <svg
      className={classes.controlBorderOverlay}
      style={{ width: TILE_WIDTH, height: TILE_HEIGHT }}
      viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={pointsString} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {closedSides.map((sideIndex) => {
          const side = sides[sideIndex];
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
