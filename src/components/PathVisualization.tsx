import { useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { PathResult } from "../utils/tileDistances";
import {
  createPositionMap,
  calculatePathPoints,
} from "../utils/pathVisualization";
import classes from "./PathVisualization.module.css";
import { useGameData } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import {
  getMapContainerOffset,
  getMapLayoutConfig,
  type MapLayout,
} from "@/components/main/MapView/mapLayout";

type PathVisualizationProps = {
  pathResult: PathResult | null;
  activePathIndex: number;
  onPathIndexChange: (index: number) => void;
  mapLayout?: MapLayout;
  mapZoom?: number;
  containerMode?: "mapArea" | "tileContainer";
  renderSelectorInPortal?: boolean;
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
  activePathIndex,
  onPathIndexChange,
  mapLayout = "panels",
  mapZoom,
  containerMode = "mapArea",
  renderSelectorInPortal = false,
}: PathVisualizationProps) => {
  if (!pathResult?.paths.length) return null;

  const validatedPathIndex =
    activePathIndex >= pathResult.paths.length ? 0 : activePathIndex;
  const currentPath = pathResult.paths[validatedPathIndex];

  const zoom = mapZoom ?? useAppStore((state) => state.zoomLevel);
  const settings = useSettingsStore().settings;
  const gameData = useGameData();
  const layoutConfig = getMapLayoutConfig(mapLayout);
  const { top, left } =
    containerMode === "tileContainer"
      ? { top: 0, left: 0 }
      : getMapContainerOffset(layoutConfig, zoom);

  const positionMap = createPositionMap(gameData?.calculatedTilePositions || []);

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

  const svgStyle =
    containerMode === "tileContainer"
      ? { top, left }
      : {
          ...(settings.isFirefox ? {} : { zoom: zoom }),
          MozTransform: `scale(${zoom})`,
          MozTransformOrigin: "top left",
          top,
          left,
        };

  const selector = renderPathSelector();

  return (
    <>
      <svg id="pathviz" className={classes.svg} style={svgStyle}>
        {renderPathLines()}
        {renderStepDots()}
      </svg>
      {renderSelectorInPortal && typeof document !== "undefined"
        ? createPortal(selector, document.body)
        : selector}
    </>
  );
};
