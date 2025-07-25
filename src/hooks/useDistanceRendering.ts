import { useState, useCallback, useEffect, useMemo } from "react";
import { calculateOptimalPaths, PathResult } from "../utils/tileDistances";

type UseDistanceRenderingProps = {
  distanceMode: boolean;
  systemIdToPosition: Record<string, string>;
  tileUnitData?: any;
};

export function useDistanceRendering({
  distanceMode,
  systemIdToPosition,
  tileUnitData,
}: UseDistanceRenderingProps) {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [activePathIndex, setActivePathIndex] = useState(0);

  const systemsOnPath = useMemo(() => {
    if (!pathResult || pathResult.paths.length === 0) {
      return new Set<string>();
    }

    // Ensure activePathIndex is valid
    const validatedIndex =
      activePathIndex >= pathResult.paths.length ? 0 : activePathIndex;
    const activePath = pathResult.paths[validatedIndex];

    if (!activePath) {
      return new Set<string>();
    }

    // Only include systems from the currently active path
    return new Set(activePath.systemIds);
  }, [pathResult, activePathIndex]);

  const handleTileSelect = useCallback(
    (systemId: string) => {
      if (!distanceMode) return;

      setSelectedTiles((prev) => {
        if (prev.includes(systemId)) {
          const newSelection = prev.filter((tile) => tile !== systemId);
          setPathResult(null);
          setActivePathIndex(0);
          return newSelection;
        }

        if (prev.length >= 2) {
          const newSelection = [prev[1], systemId];
          const paths = calculateOptimalPaths(
            newSelection[0],
            newSelection[1],
            systemIdToPosition,
            tileUnitData
          );
          setPathResult(paths);
          setActivePathIndex(0); // Reset to first path when new calculation
          return newSelection;
        }

        const newSelection = [...prev, systemId];

        if (newSelection.length === 2) {
          const paths = calculateOptimalPaths(
            newSelection[0],
            newSelection[1],
            systemIdToPosition,
            tileUnitData
          );
          setPathResult(paths);
          setActivePathIndex(0); // Reset to first path when new calculation
        }

        return newSelection;
      });
    },
    [distanceMode, systemIdToPosition, tileUnitData]
  );

  const handleTileHover = useCallback(
    (systemId: string, isHovered: boolean) => {
      if (!distanceMode) return;
      setHoveredTile(isHovered ? systemId : null);
    },
    [distanceMode]
  );

  const handlePathIndexChange = useCallback((newIndex: number) => {
    setActivePathIndex(newIndex);
  }, []);

  useEffect(() => {
    if (!distanceMode) {
      setSelectedTiles([]);
      setPathResult(null);
      setHoveredTile(null);
      setActivePathIndex(0);
    }
  }, [distanceMode]);

  return {
    selectedTiles,
    pathResult,
    hoveredTile,
    systemsOnPath,
    activePathIndex,
    handleTileSelect,
    handleTileHover,
    handlePathIndexChange,
  };
}
