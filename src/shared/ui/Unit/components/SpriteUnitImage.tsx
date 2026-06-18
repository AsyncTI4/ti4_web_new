import React from "react";
import cx from "clsx";
import { UnitSprite } from "../unitSprites";
import "../unitSprites.css";

type SpriteUnitImageProps = {
  sprite: UnitSprite;
  alt: string;
  className?: string;
  scaled?: boolean;
};

export function SpriteUnitImage(
  props: SpriteUnitImageProps
): React.ReactElement {
  const { sprite, alt, className, scaled } = props;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cx(
        "unit-sprite",
        scaled && "unit-sprite--scaled",
        `unit-sprite--${sprite.color}`,
        `unit-sprite--${sprite.unit}`,
        className
      )}
    />
  );
}
