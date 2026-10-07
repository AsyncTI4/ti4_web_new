import { useEffect, RefObject } from "react";
import { useAppStore } from "@/utils/appStore";
import { useGameContext } from "@/hooks/useGameContext";
import { getPlanetData, getPlanetLocalPosition } from "@/entities/lookup/planets";
import { TilePosition } from "@/domains/map/model/mapgen/tilePositioning";
import type { Point } from "@/entities/data/types";

type UseScrollToPlanetProps = {
  mapContainerRef: RefObject<HTMLDivElement | null>;
  zoom: number;
};

const VIEWPORT_MARGIN = 100;
const TILE_CENTER_OFFSET = { x: 172, y: 150 };

/**
 * Smoothly centers the planet named by the store's scrollToPlanetId when it
 * sits outside the visible viewport, then clears the request.
 */
export function useScrollToPlanet({
  mapContainerRef,
  zoom,
}: UseScrollToPlanetProps) {
  const scrollToPlanetId = useAppStore((state) => state.scrollToPlanetId);
  const setScrollToPlanetId = useAppStore((state) => state.setScrollToPlanetId);
  const enhancedData = useGameContext();
  const tilePositions = enhancedData?.calculatedTilePositions || [];

  useEffect(() => {
    if (!scrollToPlanetId || !mapContainerRef.current || tilePositions.length === 0) {
      return;
    }

    const planetPosition = getPlanetWorldPosition(scrollToPlanetId, tilePositions);
    if (!planetPosition) {
      setScrollToPlanetId(null);
      return;
    }

    const container = mapContainerRef.current;
    const { x: planetX, y: planetY } = planetPosition;

    const scaledX = planetX * zoom;
    const scaledY = planetY * zoom;

    const visibleLeft = container.scrollLeft;
    const visibleTop = container.scrollTop;
    const visibleRight = visibleLeft + container.clientWidth;
    const visibleBottom = visibleTop + container.clientHeight;

    const isVisible =
      scaledX > visibleLeft + VIEWPORT_MARGIN &&
      scaledX < visibleRight - VIEWPORT_MARGIN &&
      scaledY > visibleTop + VIEWPORT_MARGIN &&
      scaledY < visibleBottom - VIEWPORT_MARGIN;

    // Clearing lets the same planet be requested again.
    setScrollToPlanetId(null);

    if (isVisible) return;

    container.scrollTo({
      left: scaledX - container.clientWidth / 2,
      top: scaledY - container.clientHeight / 2,
      behavior: "smooth",
    });
  }, [scrollToPlanetId, mapContainerRef, tilePositions, zoom, setScrollToPlanetId]);
}

/** Map position of a planet: its tile's position plus its in-tile offset. */
function getPlanetWorldPosition(
  planetId: string,
  tilePositions: TilePosition[]
): Point | null {
  const planet = getPlanetData(planetId);
  if (!planet) return null;

  const systemId = planet.tileId;
  if (!systemId) return null;

  const tilePosition = tilePositions.find((tp) => tp.systemId === systemId);
  if (!tilePosition) return null;

  const offset = getPlanetLocalPosition(planet) ?? TILE_CENTER_OFFSET;

  return {
    x: tilePosition.x + offset.x,
    y: tilePosition.y + offset.y,
  };
}
