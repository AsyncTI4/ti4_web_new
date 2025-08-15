import { useMemo, useCallback } from "react";
import { PathResult } from "../utils/tileDistances";
import {
  createPositionMap,
  calculatePathPoints,
} from "../utils/pathVisualization";
import type { TilePosition } from "../mapgen/tilePositioning";
import classes from "./PathVisualization.module.css";
//
// mapPadding is passed from parent to avoid circular imports

type PathVisualizationProps = {
  pathResult: PathResult | null;
  tilePositions?: TilePosition[];
  zoom: number;
  activePathIndex: number;
  onPathIndexChange: (index: number) => void;
  mapPadding?: number;
};

const PATH_COLORS = [
  {
    stroke: "var(--mantine-color-orange-6)",
    fill: "var(--mantine-color-orange-6)",
  },
  {
    stroke: "var(--mantine-color-cyan-6)",
    fill: "var(--mantine-color-cyan-6)",
  },
  {
    stroke: "var(--mantine-color-violet-6)",
    fill: "var(--mantine-color-violet-6)",
  },
  {
    stroke: "var(--mantine-color-pink-6)",
    fill: "var(--mantine-color-pink-6)",
  },
  {
    stroke: "var(--mantine-color-gray-6)",
    fill: "var(--mantine-color-gray-6)",
  },
  { stroke: "var(--mantine-color-red-6)", fill: "var(--mantine-color-red-6)" },
];

export const PathVisualization = ({
  pathResult,
  tilePositions,
  zoom,
  activePathIndex,
  onPathIndexChange,
  mapPadding = 200,
}: PathVisualizationProps) => {
  if (!pathResult?.paths.length) return null;

  const positionMap = useMemo(
    () => createPositionMap(tilePositions || []),
    [tilePositions]
  );

  const validatedPathIndex =
    activePathIndex >= pathResult.paths.length ? 0 : activePathIndex;
  const currentPath = pathResult.paths[validatedPathIndex];

  // Detect Firefox browser
  const isFirefox = useMemo(() => {
    return (
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().indexOf("firefox") > -1
    );
  }, []);

  const pathPoints = useMemo(() => {
    if (!currentPath) return [];
    return calculatePathPoints(
      currentPath,
      positionMap,
      1, // Pass zoom as 1 since we'll apply it via CSS transform
      0 // Pass mapPadding as 0 since we'll handle it via CSS positioning
    );
  }, [currentPath, positionMap]);

  const currentColors = useMemo(
    () => PATH_COLORS[validatedPathIndex % PATH_COLORS.length],
    [validatedPathIndex]
  );

  const handlePrevPath = useCallback(() => {
    const newIndex =
      activePathIndex === 0 ? pathResult.paths.length - 1 : activePathIndex - 1;
    onPathIndexChange(newIndex);
  }, [activePathIndex, pathResult.paths.length, onPathIndexChange]);

  const handleNextPath = useCallback(() => {
    const newIndex = (activePathIndex + 1) % pathResult.paths.length;
    onPathIndexChange(newIndex);
  }, [activePathIndex, pathResult.paths.length, onPathIndexChange]);

  // Auto-correct invalid path index
  if (activePathIndex >= pathResult.paths.length) {
    onPathIndexChange(0);
  }

  if (!currentPath || pathPoints.length === 0) return null;

  const renderPathLines = () => {
    if (pathPoints.length < 2) return null;

    return (
      <g>
        {pathPoints.slice(0, -1).map((point, index) => {
          const nextPoint = pathPoints[index + 1];
          return (
            <line
              key={`line-${index}`}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={currentColors.stroke}
              strokeWidth={12}
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}
      </g>
    );
  };

  const renderStepDots = () => (
    <g>
      {pathPoints.map((point, index) => (
        <g key={`dot-${index}`}>
          <circle
            cx={point.x}
            cy={point.y}
            r={35}
            fill={currentColors.fill}
            stroke="white"
            strokeWidth={5}
            opacity={0.9}
          />
          {point.stepNumber > 0 && (
            <text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={24}
              fontWeight="bold"
              fontFamily="'Slider', system-ui, -apple-system, sans-serif"
            >
              {point.stepNumber - 1}
            </text>
          )}
        </g>
      ))}
    </g>
  );

  const renderPathSelector = () => {
    if (pathResult.paths.length <= 1) return null;

    return (
      <div className={classes.pathSelector}>
        <button className={classes.navButton} onClick={handlePrevPath}>
          ←
        </button>

        <div className={classes.pathInfo}>
          <div
            className={classes.colorIndicator}
            style={{ backgroundColor: currentColors.fill }}
          />
          <span>
            Path {validatedPathIndex + 1} of {pathResult.paths.length}
          </span>
        </div>

        <button className={classes.navButton} onClick={handleNextPath}>
          →
        </button>
      </div>
    );
  };

  return (
    <>
      <svg
        id="pathviz"
        className={classes.svg}
        style={{
          ...(isFirefox ? {} : { zoom: zoom }),
          MozTransform: `scale(${zoom})`,
          MozTransformOrigin: "top left",
          top: mapPadding / zoom,
          left: mapPadding / zoom,
        }}
      >
        {renderPathLines()}
        {renderStepDots()}
      </svg>
      {renderPathSelector()}
    </>
  );
};
