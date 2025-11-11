import React from "react";
import { getPlanetCoordsBySystemId, getPlanetById } from "@/lookup/planets";
import { Tile } from "@/context/types";
import { getAttachmentData } from "@/lookup/attachments";
import { cdnImage } from "@/data/cdnImage";

type Props = {
  systemId: string;
  mapTile: Tile;
};

type SingleTrait = "cultural" | "hazardous" | "industrial";

const VALID_PLANET_TYPES = new Set(["cultural", "hazardous", "industrial"]);

function resolveFinalTraits(
  planetTypes: string[],
  attachmentPlanetTypes: string[]
): SingleTrait[] {
  const traits = new Set<SingleTrait>();
  for (const t of planetTypes) {
    const key = t.toLowerCase();
    if (VALID_PLANET_TYPES.has(key)) traits.add(key as SingleTrait);
  }
  for (const t of attachmentPlanetTypes) {
    const key = t.toLowerCase();
    if (VALID_PLANET_TYPES.has(key)) traits.add(key as SingleTrait);
  }
  return Array.from(traits);
}

function getTraitIconSrc(traits: SingleTrait[]): string | null {
  if (traits.length === 0) return null;

  if (traits.length === 1) {
    return `/planet_attributes/pc_attribute_${traits[0]}.png`;
  }

  const hasC = traits.includes("cultural");
  const hasH = traits.includes("hazardous");
  const hasI = traits.includes("industrial");

  const allThree = hasC && hasH && hasI;
  const suffix = allThree
    ? "CHI"
    : `${hasC ? "C" : ""}${hasH ? "H" : ""}${hasI ? "I" : ""}`;

  return cdnImage(`/planet_cards/pc_attribute_combo_${suffix}.png`);
}

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

        const finalTraits = resolveFinalTraits(
          planetTypes,
          attachmentPlanetTypes
        );

        if (finalTraits.length === 0) return null;

        const iconSrc = getTraitIconSrc(finalTraits);
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
