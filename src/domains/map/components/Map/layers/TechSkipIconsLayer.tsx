import React from "react";
import { getPlanetCoordsBySystemId } from "@/entities/lookup/planets";
import { Tile } from "@/app/providers/context/types";

type Props = {
  systemId: string;
  mapTile: Tile;
};

const TECH_SPECIALTY_TO_ICON: Record<string, string> = {
  BIOTIC: "/green.png",
  PROPULSION: "/blue.png",
  CYBERNETIC: "/yellow.png",
  WARFARE: "/red.png",
};

export function TechSkipIconsLayer({ systemId, mapTile }: Props) {
  const planetCoords = getPlanetCoordsBySystemId(systemId);

  const techSkipIcons = React.useMemo(() => {
    if (!mapTile?.planets) return [];

    return Object.entries(mapTile.planets).flatMap(([planetId, planetData]) => {
      if (
        !planetData.techSpecialties ||
        planetData.techSpecialties.length === 0
      ) {
        return [];
      }

      const coords = planetCoords[planetId];
      if (!coords) return [];

      const [x, y] = coords.split(",").map(Number);

      return planetData.techSpecialties
        .map((specialty, index) => {
          const iconPath = TECH_SPECIALTY_TO_ICON[specialty.toUpperCase()];
          if (!iconPath) return null;

          return (
            <img
              key={`${systemId}-${planetId}-${specialty}-${index}`}
              src={iconPath}
              alt={specialty}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                width: "70px",
                zIndex: "var(--z-control-token)",
              }}
            />
          );
        })
        .filter(Boolean);
    });
  }, [systemId, mapTile, planetCoords]);

  return <>{techSkipIcons}</>;
}
