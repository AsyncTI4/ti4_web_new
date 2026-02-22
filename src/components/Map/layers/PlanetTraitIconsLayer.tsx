import React from "react";
import { getPlanetCoordsBySystemId, getPlanetById } from "@/lookup/planets";
import { Tile } from "@/context/types";
import { getAttachmentData } from "@/lookup/attachments";
import { cdnImage } from "@/data/cdnImage";
import {
  getPlanetTraitIconSrc,
  mergePlanetTraits,
} from "@/utils/planetTraits";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function PlanetTraitIconsLayer({ systemId, mapTile }: Props) {
  const planetCoords = getPlanetCoordsBySystemId(systemId);

  const traitIcons = React.useMemo(() => {
    if (!mapTile?.planets) return [];

    return Object.entries(mapTile.planets)
      .map(([planetId, planetTileData]) => {
        const planetData = getPlanetById(planetId);
        if (!planetData) return null;

        const coords = planetCoords[planetId];
        if (!coords) return null;

        const [x, y] = coords.split(",").map(Number);

        // Handle faction planets
        if (
          planetData.planetType === "FACTION" &&
          planetData.factionHomeworld
        ) {
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
                src={cdnImage(`/factions/${planetData.factionHomeworld}.png`)}
                alt={planetData.factionHomeworld}
                style={{
                  width: "80px",
                }}
              />
            </div>
          );
        }

        // Resolve final traits (combining planet types and attachment modifiers)
        const planetTypes =
          planetData.planetTypes ||
          (planetData.planetType ? [planetData.planetType] : []);

        const attachmentPlanetTypes =
          planetTileData.attachments
            ?.map((attachmentId) => {
              const attachmentData = getAttachmentData(attachmentId);
              return attachmentData?.planetTypes || [];
            })
            .flat() || [];

        const finalTraits = mergePlanetTraits(
          planetTypes,
          attachmentPlanetTypes
        );

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
  }, [systemId, mapTile, planetCoords]);

  return <>{traitIcons}</>;
}
