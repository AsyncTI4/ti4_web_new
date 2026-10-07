import {
  getPlanetPositionsBySystemId,
  getPlanetData,
} from "@/entities/lookup/planets";
import type { Tile } from "@/app/providers/context/types";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getFactionImage } from "@/entities/lookup/factions";
import { getPlanetTraitIconSrc, mergePlanetTraits } from "@/utils/planetTraits";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function PlanetTraitIconsLayer({ systemId, mapTile }: Props) {
  if (!mapTile?.planets) return null;
  const planetPositions = getPlanetPositionsBySystemId(systemId);

  const traitIcons = Object.entries(mapTile.planets)
    .map(([planetId, planetTileData]) => {
      const planetData = getPlanetData(planetId);
      if (!planetData) return null;

      const position = planetPositions[planetId];
      if (!position) return null;
      const { x, y } = position;

      if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
        return (
          <div
            key={`${systemId}-${planetId}-faction`}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
              zIndex: "var(--z-control-token)",
            }}
          >
            <img
              src={getFactionImage(planetData.factionHomeworld)}
              alt={planetData.factionHomeworld}
              style={{
                width: "80px",
              }}
            />
          </div>
        );
      }

      const planetTypes =
        planetData.planetTypes ||
        (planetData.planetType ? [planetData.planetType] : []);

      const attachmentPlanetTypes =
        planetTileData.attachments?.flatMap(
          (attachmentId) => getAttachmentData(attachmentId)?.planetTypes || [],
        ) ?? [];

      const finalTraits = mergePlanetTraits(planetTypes, attachmentPlanetTypes);

      if (finalTraits.length === 0) return null;

      const iconSrc = getPlanetTraitIconSrc(finalTraits);
      if (!iconSrc) return null;

      return (
        <div
          key={`${systemId}-${planetId}-trait`}
          style={{
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            transform: "translate(-50%, -50%)",
            width: "80px",
            zIndex: "var(--z-control-token)",
          }}
        >
          <img
            src={iconSrc}
            alt={finalTraits.join(", ")}
            style={{
              width: "80px",
            }}
          />
        </div>
      );
    })
    .filter(Boolean);

  return <>{traitIcons}</>;
}
