import React from "react";
import { getPlanetCoordsBySystemId } from "@/entities/lookup/planets";
import { Tile } from "@/app/providers/context/types";
import { getAttachmentImagePath } from "@/entities/lookup/attachments";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function AttachmentsLayer({ systemId, mapTile }: Props) {
  const planetCoords = getPlanetCoordsBySystemId(systemId);

  const attachmentMarkers = React.useMemo(() => {
    if (!mapTile?.planets) return [];

    return Object.entries(mapTile.planets).flatMap(([planetId, planetData]) => {
      if (!planetData.attachments || planetData.attachments.length === 0) return [];

      const coords = planetCoords[planetId];
      if (!coords) return [];

      const [x, y] = coords.split(",").map(Number);

      return planetData.attachments.map((attachmentId, index) => {
        const imagePath = getAttachmentImagePath(attachmentId);
        if (!imagePath) return null;

        return (
          <img
            key={`${systemId}-${planetId}-attachment-${attachmentId}-${index}`}
            src={cdnImage(imagePath)}
            alt={`Attachment: ${attachmentId}`}
            title={attachmentId}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y + index * 30}px`,
              transform: "translate(-50%, -50%)",
              width: "70px",
              height: "auto",
              zIndex: `calc(var(--z-control-token) + ${index})`,
              filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.8))",
            }}
          />
        );
      }).filter(Boolean);
    });
  }, [systemId, mapTile, planetCoords]);

  return <>{attachmentMarkers}</>;
}
