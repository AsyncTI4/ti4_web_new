import type { ImgHTMLAttributes } from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/domains/map/model/mapgen/systems";
import { boardImageLoadingProps } from "@/shared/ui/imageLoading";

type TileProps = ImgHTMLAttributes<HTMLImageElement> & {
  systemId: string;
};

export const Tile = ({ systemId, alt, ...imgProps }: TileProps) => {
  const tile = getTileById(systemId);

  if (!tile) return null;

  return (
    <img
      {...boardImageLoadingProps}
      src={cdnImage(`/tiles/${tile.imagePath}`)}
      alt={alt || `System ${systemId}`}
      {...imgProps}
    />
  );
};
