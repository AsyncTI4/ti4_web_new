import { useMemo, useEffect } from "react";
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

type PlayerStatsHexProps = {
  tilePositions: Array<{ x: number; y: number; systemId: string }>;
  faction: string;
  openSides: Record<string, number[]>;
  borderColor: string;
  backgroundTint?: string;
  onHexagonsCalculated?: (
    hexagons: HexagonData[],
    svgBounds: SVGBounds
  ) => void;
};

export function PlayerStatsHex({
  tilePositions,
  faction,
  openSides,
  borderColor,
  backgroundTint,
  onHexagonsCalculated,
}: PlayerStatsHexProps) {
  // Calculate hexagon properties and SVG bounds
  const { hexagons, svgBounds } = useMemo(() => {
    if (tilePositions.length === 0)
      return { hexagons: [], svgBounds: { x: 0, y: 0, width: 0, height: 0 } };

    // Hexagon dimensions to fit in 345x299 box
    const radius = 172.5; // Width = 345px
    const height = Math.sqrt(3) * radius; // ~298.7px

    // Map hexagon side indices to tile adjacency directions
    // Hexagon starts at 0° (East), tile adjacency: 0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW
    const sideToDirectionMap = [2, 3, 4, 5, 0, 1]; // SE, S, SW, NW, N, NE

    const hexagons: HexagonData[] = tilePositions.map((tile, index) => {
      const position = tile.systemId.replace("stat_", "");
      const cx = tile.x + 172.5; // Center the hexagon in the 345px width
      const cy = tile.y + 149.5; // Center the hexagon in the 299px height
      const points = generateHexagonPoints(cx, cy, radius);
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
          isOpen: tileOpenSides.includes(sideToDirectionMap[sideIndex]),
        })),
      };
    });

    // Calculate bounding box for all hexagons
    const allX = hexagons.flatMap((hex) => [hex.cx - radius, hex.cx + radius]);
    const allY = hexagons.flatMap((hex) => [
      hex.cy - height / 2,
      hex.cy + height / 2,
    ]);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const svgBounds = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };

    return { hexagons, svgBounds };
  }, [tilePositions, faction, openSides]);

  // Call the callback with calculated data
  useEffect(() => {
    if (onHexagonsCalculated) {
      onHexagonsCalculated(hexagons, svgBounds);
    }
  }, [hexagons, svgBounds, onHexagonsCalculated]);

  if (tilePositions.length === 0) return null;

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
        {/* Surface gradient matching Surface.tsx */}
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

        {/* Tinted gradient for active/passed states */}
        {backgroundTint && (
          <linearGradient
            id={`tintedGradient-${faction}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={backgroundTint} />
            <stop offset="100%" stopColor={backgroundTint} />
          </linearGradient>
        )}

        {/* Elegant drop shadow */}
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

      {/* Render hexagons */}
      {hexagons.map((hex) => (
        <g key={hex.id}>
          {/* Base filled polygon */}
          <polygon
            points={hex.points}
            fill={`url(#surfaceGradient-${faction})`}
            filter={`url(#dropShadow-${faction})`}
            transform={`translate(${-svgBounds.x}, ${-svgBounds.y})`}
          />

          {/* Tinted overlay if backgroundTint is provided */}
          {backgroundTint && (
            <polygon
              points={hex.points}
              fill={backgroundTint}
              opacity="0.3"
              transform={`translate(${-svgBounds.x}, ${-svgBounds.y})`}
            />
          )}

          {/* Individual border lines for each side */}
          {hex.sides.map((side, sideIndex) => {
            if (side.isOpen) return null; // Don't render border for open sides

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

// Generate hexagon points for flat-top hexagon
const generateHexagonPoints = (cx: number, cy: number, radius: number) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = i * 60 * (Math.PI / 180); // Start at 0° for flat-top orientation
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
};

// Generate line segments for each side of the hexagon
const generateHexagonSides = (points: { x: number; y: number }[]) => {
  const sides = [];
  for (let i = 0; i < 6; i++) {
    const nextI = (i + 1) % 6;
    sides.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[nextI].x,
      y2: points[nextI].y,
    });
  }
  return sides;
};

// Export types for use in parent component
export type { HexagonData, SVGBounds };
