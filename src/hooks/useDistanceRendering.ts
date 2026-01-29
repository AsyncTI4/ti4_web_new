import { useState, useCallback, useEffect, useMemo } from "react";
import { calculateOptimalPaths, PathResult } from "../utils/tileDistances";

import { Tile } from "@/context/types";

type UseDistanceRenderingProps = {
  distanceMode: boolean;
  tiles: Tile[];
};

export function useDistanceRendering({
  distanceMode,
  tiles,
}: UseDistanceRenderingProps) {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]); // positions
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null); // position
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

    // Only include positions from the currently active path
    return new Set(activePath.positions);
  }, [pathResult, activePathIndex]);

  const handleTileSelect = useCallback(
    (position: string) => {
      if (!distanceMode) return;

      setSelectedTiles((prev) => {
        if (prev.includes(position)) {
          const newSelection = prev.filter((tile) => tile !== position);
          setPathResult(null);
          setActivePathIndex(0);
          return newSelection;
        }

        if (prev.length >= 2) {
          const newSelection = [prev[1], position];
          const paths = calculateOptimalPaths(
            newSelection[0],
            newSelection[1],
            tiles
          );
          setPathResult(paths);
          setActivePathIndex(0); // Reset to first path when new calculation
          return newSelection;
        }

        const newSelection = [...prev, position];

        if (newSelection.length === 2) {
          const paths = calculateOptimalPaths(
            newSelection[0],
            newSelection[1],
            tiles
          );
          setPathResult(paths);
          setActivePathIndex(0); // Reset to first path when new calculation
        }

        return newSelection;
      });
    },
    [distanceMode, tiles]
  );

  const handleTileHover = useCallback(
    (position: string, isHovered: boolean) => {
      if (!distanceMode) return;
      setHoveredTile(isHovered ? position : null);
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
