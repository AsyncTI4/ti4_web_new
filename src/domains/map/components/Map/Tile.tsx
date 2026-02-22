import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/domains/map/model/mapgen/systems";

interface TileProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  systemId: string;
}

export const Tile: React.FC<TileProps> = ({ systemId, alt, ...imgProps }) => {
  const tile = getTileById(systemId);

  if (!tile) return null;

  return (
    <img
      src={cdnImage(`/tiles/${tile.imagePath}`)}
      alt={alt || `System ${systemId}`}
      {...imgProps}
    />
  );
};
