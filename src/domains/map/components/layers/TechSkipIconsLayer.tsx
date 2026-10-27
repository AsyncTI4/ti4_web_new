import { Tile } from "@/entities/game/types";
import { TECH_COLOR_IMAGES } from "@/entities/data/uiImages";
import { TECH_TYPE_COLOR } from "@/entities/lookup/tech";
import { PlanetMarkersLayer } from "./PlanetMarkersLayer";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function TechSkipIconsLayer({ systemId, mapTile }: Props) {
  return (
    <PlanetMarkersLayer
      systemId={systemId}
      mapTile={mapTile}
      renderMarkers={(planetId, planet, x, y) =>
        (planet.techSpecialties ?? []).flatMap((specialty, index) => {
          const color = TECH_TYPE_COLOR[specialty.toUpperCase()];
          if (!color) return [];

          return [
            <img
              key={`${systemId}-${planetId}-${specialty}-${index}`}
              src={TECH_COLOR_IMAGES[color]}
              alt={specialty}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                width: "70px",
                zIndex: "var(--z-control-token)",
              }}
            />,
          ];
        })
      }
    />
  );
}
