import {
  generateHexagonPoints,
  generateHexagonSides,
  HEX_SIDE_TO_TILE_DIRECTION,
} from "@/entities/geometry/hexagonUtils";
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/entities/geometry/tilePositioning";
import styles from "./PlayerStatsArea.module.css";

type HexagonData = {
  id: string;
  position: string;
  cx: number;
  cy: number;
  points: string;
  sides: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isOpen: boolean;
  }>;
};

type SVGBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const HEX_RADIUS = TILE_WIDTH / 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;

/**
 * Builds the stat-area hexagons and the SVG box that holds them. Side indices
 * start at East; tile adjacency directions are 0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW.
 */
export function buildStatHexagons(
  tilePositions: Array<{ x: number; y: number; systemId: string }>,
  faction: string,
  openSides: Record<string, number[]>,
): { hexagons: HexagonData[]; svgBounds: SVGBounds } {
  if (tilePositions.length === 0)
    return { hexagons: [], svgBounds: { x: 0, y: 0, width: 0, height: 0 } };

  const hexagons: HexagonData[] = tilePositions.map((tile, index) => {
    const position = tile.systemId.replace("stat_", "");
    const cx = tile.x + TILE_WIDTH / 2;
    const cy = tile.y + TILE_HEIGHT / 2;
    const points = generateHexagonPoints(cx, cy, HEX_RADIUS);
    const sides = generateHexagonSides(points);
    const tileOpenSides = openSides[position] || [];

    return {
      id: `${faction}-stat-${index}`,
      position,
      cx,
      cy,
      points: points.map((p) => `${p.x},${p.y}`).join(" "),
      sides: sides.map((side, sideIndex) => ({
        ...side,
        isOpen: tileOpenSides.includes(HEX_SIDE_TO_TILE_DIRECTION[sideIndex]),
      })),
    };
  });

  const allX = hexagons.flatMap((hex) => [
    hex.cx - HEX_RADIUS,
    hex.cx + HEX_RADIUS,
  ]);
  const allY = hexagons.flatMap((hex) => [
    hex.cy - HEX_HEIGHT / 2,
    hex.cy + HEX_HEIGHT / 2,
  ]);
  const minX = Math.min(...allX);
  const minY = Math.min(...allY);

  return {
    hexagons,
    svgBounds: {
      x: minX,
      y: minY,
      width: Math.max(...allX) - minX,
      height: Math.max(...allY) - minY,
    },
  };
}

type PlayerStatsHexProps = {
  hexagons: HexagonData[];
  svgBounds: SVGBounds;
  faction: string;
  borderColor: string;
  backgroundTint?: string;
};

export function PlayerStatsHex({
  hexagons,
  svgBounds,
  faction,
  borderColor,
  backgroundTint,
}: PlayerStatsHexProps) {
  if (hexagons.length === 0) return null;

  return (
    <svg
      className={styles.svg}
      style={{
        left: svgBounds.x,
        top: svgBounds.y,
        width: svgBounds.width,
        height: svgBounds.height,
        overflow: "inherit",
      }}
      viewBox={`0 0 ${svgBounds.width} ${svgBounds.height}`}
    >
      <defs>
        <linearGradient
          id={`surfaceGradient-${faction}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0.95)" />
          <stop offset="100%" stopColor="rgba(30, 41, 59, 0.9)" />
        </linearGradient>

        <filter
          id={`dropShadow-${faction}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dx="2" dy="4" result="offsetBlur" />
          <feFlood
            floodColor="#000000"
            floodOpacity="0.25"
            result="shadowColor"
          />
          <feComposite
            in="shadowColor"
            in2="offsetBlur"
            operator="in"
            result="shadow"
          />
          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
        </filter>
      </defs>

      {hexagons.map((hex) => (
        <g key={hex.id}>
          <polygon
            points={hex.points}
            fill={`url(#surfaceGradient-${faction})`}
            filter={`url(#dropShadow-${faction})`}
            transform={`translate(${-svgBounds.x}, ${-svgBounds.y})`}
          />

          {backgroundTint && (
            <polygon
              points={hex.points}
              fill={backgroundTint}
              opacity="0.3"
              transform={`translate(${-svgBounds.x}, ${-svgBounds.y})`}
            />
          )}

          {hex.sides.map((side, sideIndex) => {
            if (side.isOpen) return null;
            return (
              <line
                key={`${hex.id}-side-${sideIndex}`}
                x1={side.x1 - svgBounds.x}
                y1={side.y1 - svgBounds.y}
                x2={side.x2 - svgBounds.x}
                y2={side.y2 - svgBounds.y}
                stroke={borderColor}
                className={styles.borderLine}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

