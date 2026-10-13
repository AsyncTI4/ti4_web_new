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
      style={{
        width: sprite.width,
        height: sprite.height,
        backgroundImage: `url("https://images.asyncti4.com/tokens/sheets/${sprite.sheet}.webp?v=4")`,
        backgroundSize: `${sprite.sheetWidth}px ${sprite.sheetHeight}px`,
        backgroundPosition: `-${sprite.x}px -${sprite.y}px`,
        ...style,
      }}
      className={cx("token-sprite", className)}
    />
  );
}
