import type { CSSProperties } from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { TokenSprite } from "@/shared/ui/Token/components/TokenSprite";
import type { TokenSprite as TokenSpriteData } from "@/shared/ui/Token/tokenSprites";

type Props = {
  sprite: TokenSpriteData | undefined;
  imagePath: string;
  alt: string;
  style: CSSProperties;
};

/** Renders a token-sheet sprite when one exists, else the standalone image. */
export function PositionedSprite({ sprite, imagePath, alt, style }: Props) {
  if (sprite) return <TokenSprite sprite={sprite} alt={alt} style={style} />;
  return <img src={cdnImage(imagePath)} alt={alt} style={style} />;
}
