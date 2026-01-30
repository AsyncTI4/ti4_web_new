import { useAppStore } from "@/utils/appStore";
import { useGameContext } from "@/hooks/useGameContext";
import { useEffect, useRef } from "react";

type UseMapScrollPositionProps = {
  zoom: number;
  gameId: string;
  mapPadding: number;
};

export function useMapScrollPosition({
  zoom,
  gameId,
  mapPadding,
}: UseMapScrollPositionProps) {
  const enhancedData = useGameContext();
  // Ref for the scrollable map container
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Track if we've set the initial scroll position and for which game
  const hasSetInitialScroll = useRef(false);
  const lastGameId = useRef<string | null>(null);

  // Reset scroll flag when switching games
  useEffect(() => {
    if (lastGameId.current !== gameId) {
      hasSetInitialScroll.current = false;
      lastGameId.current = gameId;
    }
  }, [gameId]);

  // Set initial scroll position only once when loading a new game
  useEffect(() => {
    const playerData = enhancedData?.playerData;
    const tilePositions = enhancedData?.calculatedTilePositions || [];

    if (
      mapContainerRef.current &&
      playerData &&
      tilePositions.length > 0 &&
      !hasSetInitialScroll.current
    ) {
      // Use requestAnimationFrame to ensure DOM is updated after rendering
      requestAnimationFrame(() => {
        if (mapContainerRef.current) {
          const container = mapContainerRef.current;

          // Calculate center position based on actual content dimensions
          const centerX = (container.scrollWidth - container.clientWidth) / 2;
          const centerY = (container.scrollHeight - container.clientHeight) / 2;

          container.scrollLeft = centerX + mapPadding * zoom;
          container.scrollTop = centerY + mapPadding * zoom;
          hasSetInitialScroll.current = true;
        }
      });
    }
  }, [
    enhancedData?.playerData,
    enhancedData?.calculatedTilePositions,
    zoom,
    mapPadding,
  ]);

  return {
    mapContainerRef,
  };
}
