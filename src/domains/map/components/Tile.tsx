import type { CSSProperties, ImgHTMLAttributes } from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/entities/lookup/systems";
import {
  CUSTOM_HYPERLANE_TILE_ID,
  getHyperlaneBackground,
} from "@/entities/game/customHyperlanes";
import { boardImageLoadingProps } from "@/shared/ui/imageLoading";

type TileProps = ImgHTMLAttributes<HTMLImageElement> & {
  systemId: string;
  /** Connection matrix of a custom hyperlane; picks the same background as the bot. */
  customHyperlane?: string;
};

export const Tile = ({
  systemId,
  customHyperlane,
  alt,
  style,
  ...imgProps
}: TileProps) => {
  const tile = getTileById(systemId);

  if (!tile) return null;

  let imagePath = tile.imagePath;
  let flipStyle: CSSProperties | undefined;
  if (systemId === CUSTOM_HYPERLANE_TILE_ID) {
    const background = getHyperlaneBackground(customHyperlane);
    imagePath = background.imagePath;
    if (background.flipX || background.flipY) {
      flipStyle = {
        transform: `scale(${background.flipX ? -1 : 1}, ${background.flipY ? -1 : 1})`,
      };
    }
  }

  return (
    <img
      {...boardImageLoadingProps}
      src={cdnImage(`/tiles/${imagePath}`)}
      alt={alt || `System ${systemId}`}
      style={flipStyle ? { ...style, ...flipStyle } : style}
      {...imgProps}
    />
  );
};
