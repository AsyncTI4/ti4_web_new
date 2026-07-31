import React from "react";
import cx from "clsx";
import { TokenSprite as TokenSpriteData } from "../tokenSprites";
import "../tokenSprites.css";

type TokenSpriteProps = React.HTMLAttributes<HTMLDivElement> & {
  sprite: TokenSpriteData;
  alt: string;
};

export function TokenSprite({
  sprite,
  alt,
  className,
  style,
  ...props
}: TokenSpriteProps): React.ReactElement {
  return (
    <div
      role="img"
      aria-label={alt}
      {...props}
      style={{ width: sprite.width, height: sprite.height, ...style }}
      className={cx(
        "token-sprite",
        sprite.sheetClassName,
        `token-sprite--${sprite.kind}-${sanitizeSpriteId(sprite.id)}`,
        className,
      )}
    />
  );
}

function sanitizeSpriteId(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/^-+/, "");
}
