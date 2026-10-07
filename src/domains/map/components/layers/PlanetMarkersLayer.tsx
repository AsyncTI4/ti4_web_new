import type { ReactElement } from "react";
import { getPlanetPositionsBySystemId } from "@/entities/lookup/planets";
import type { Tile, TilePlanet } from "@/app/providers/context/types";
import { PlanetOwnerBadge } from "./PlanetOwnerBadge";

type Props = {
  systemId: string;
  mapTile: Tile;
  renderMarkers: (
    planetId: string,
    planet: TilePlanet,
    x: number,
    y: number,
  ) => ReactElement[];
};

/**
 * Draws per-planet markers at each planet's center, plus the controller's
 * badge on any planet that has at least one marker.
 */
export function PlanetMarkersLayer({ systemId, mapTile, renderMarkers }: Props) {
  if (!mapTile?.planets) return null;
  const planetPositions = getPlanetPositionsBySystemId(systemId);

  const elements = Object.entries(mapTile.planets).flatMap(
    ([planetId, planet]) => {
      const position = planetPositions[planetId];
      if (!position) return [];

      const { x, y } = position;
      const markers = renderMarkers(planetId, planet, x, y);
      if (markers.length === 0) return [];
      if (!planet.controlledBy) return markers;

      return [
        ...markers,
        <PlanetOwnerBadge
          key={`${systemId}-${planetId}-owner`}
          faction={planet.controlledBy}
          x={x}
          y={y}
        />,
      ];
    },
  );

  return <>{elements}</>;
}
