import { MAP_PADDING } from "@/NewMapUI";
import { useAppStore } from "@/utils/appStore";
import { useEffect, useRef } from "react";

type UseMapScrollPositionProps = {
  playerData: any[] | undefined;
  tilePositions: any[];
  zoom: number;
  gameId: string;
};

export function useMapScrollPosition({
  playerData,
  tilePositions,
  zoom,
  gameId,
}: UseMapScrollPositionProps) {
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

          container.scrollLeft = centerX + MAP_PADDING * zoom;
          container.scrollTop = centerY + MAP_PADDING * zoom;
          hasSetInitialScroll.current = true;
        }
      });
    }
  }, [playerData, tilePositions, zoom, MAP_PADDING]);

  return {
    mapContainerRef,
  };
}
