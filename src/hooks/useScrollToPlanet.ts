import { useEffect, RefObject } from "react";
import { useAppStore } from "@/utils/appStore";
import { useGameContext } from "@/hooks/useGameContext";
import { getPlanetById } from "@/entities/lookup/planets";
import { TilePosition } from "@/domains/map/model/mapgen/tilePositioning";

type UseScrollToPlanetProps = {
  mapContainerRef: RefObject<HTMLDivElement>;
  zoom: number;
};

/**
 * Hook that scrolls the map to bring a clicked planet into view.
 * Watches the scrollToPlanetId from the app store and scrolls smoothly
 * to center the planet if it's outside the visible viewport.
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

    // Account for zoom when calculating screen position
    const scaledX = planetX * zoom;
    const scaledY = planetY * zoom;

    // Calculate the current visible bounds
    const visibleLeft = container.scrollLeft;
    const visibleTop = container.scrollTop;
    const visibleRight = visibleLeft + container.clientWidth;
    const visibleBottom = visibleTop + container.clientHeight;

    // Add margin so we scroll before the planet is right at the edge
    const margin = 100;

    const isVisible =
      scaledX > visibleLeft + margin &&
      scaledX < visibleRight - margin &&
      scaledY > visibleTop + margin &&
      scaledY < visibleBottom - margin;

    // Clear the scroll target after processing (allows re-clicking same planet)
    setScrollToPlanetId(null);

    if (isVisible) return;

    // Calculate scroll position to center the planet
    const targetScrollLeft = scaledX - container.clientWidth / 2;
    const targetScrollTop = scaledY - container.clientHeight / 2;

    container.scrollTo({
      left: targetScrollLeft,
      top: targetScrollTop,
      behavior: "smooth",
    });
  }, [scrollToPlanetId, mapContainerRef, tilePositions, zoom, setScrollToPlanetId]);
}

/**
 * Calculate the world position of a planet (tile position + planet offset within tile)
 */
function getPlanetWorldPosition(
  planetId: string,
  tilePositions: TilePosition[]
): { x: number; y: number } | null {
  const planet = getPlanetById(planetId);
  if (!planet) return null;

  // Get the system/tile ID this planet belongs to
  const systemId = planet.tileId;
  if (!systemId) return null;

  // Find the tile position for this system
  const tilePosition = tilePositions.find((tp) => tp.systemId === systemId);
  if (!tilePosition) return null;

  // Get the planet's position within the tile
  let planetOffsetX = 0;
  let planetOffsetY = 0;

  if (planet.planetLayout?.centerPosition) {
    planetOffsetX = planet.planetLayout.centerPosition.x;
    planetOffsetY = planet.planetLayout.centerPosition.y;
  } else if (planet.positionInTile) {
    planetOffsetX = planet.positionInTile.x;
    planetOffsetY = planet.positionInTile.y;
  } else {
    // Default to tile center if no position info
    planetOffsetX = 172; // TILE_WIDTH / 2
    planetOffsetY = 150; // TILE_HEIGHT / 2
  }

  return {
    x: tilePosition.x + planetOffsetX,
    y: tilePosition.y + planetOffsetY,
  };
}
