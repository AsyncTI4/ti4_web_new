import { useGameContext } from "@/state/useGameContext";
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hasSetInitialScroll = useRef(false);
  const lastGameId = useRef<string | null>(null);

  useEffect(() => {
    if (lastGameId.current === gameId) return;
    hasSetInitialScroll.current = false;
    lastGameId.current = gameId;
  }, [gameId]);

  /** Centers the board once per game, after the first render with tiles. */
  useEffect(() => {
    const playerData = enhancedData?.playerData;
    const tilePositions = enhancedData?.calculatedTilePositions || [];
    if (!mapContainerRef.current || !playerData) return;
    if (tilePositions.length === 0 || hasSetInitialScroll.current) return;

    requestAnimationFrame(() => {
      const container = mapContainerRef.current;
      if (!container) return;

      const centerX = (container.scrollWidth - container.clientWidth) / 2;
      const centerY = (container.scrollHeight - container.clientHeight) / 2;
      container.scrollLeft = centerX + mapPadding * zoom;
      container.scrollTop = centerY + mapPadding * zoom;
      hasSetInitialScroll.current = true;
    });
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
