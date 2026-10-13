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
  props: SpriteUnitImageProps,
): React.ReactElement {
  const { sprite, alt, className, scaled } = props;
  const { x, y, width, height, sheetWidth, sheetHeight } = sprite;

  const style = {
    "--unit-sprite-width": `${width}px`,
    "--unit-sprite-height": `${height}px`,
    "--unit-sprite-aspect": `${width} / ${height}`,
    backgroundImage: sprite.image && `url("${sprite.image}")`,
    // Scaled sprites stretch to whatever box the caller gives them, so the
    // sheet is sized and offset in percentages of the frame.
    backgroundSize: scaled
      ? `${percent(sheetWidth, width)} ${percent(sheetHeight, height)}`
      : `${sheetWidth}px ${sheetHeight}px`,
    backgroundPosition: scaled
      ? `${percent(x, sheetWidth - width)} ${percent(y, sheetHeight - height)}`
      : `-${x}px -${y}px`,
    ...(!scaled && { width, height }),
  } as React.CSSProperties;

  return (
    <div
      role="img"
      aria-label={alt}
      style={style}
      className={cx("unit-sprite", className)}
    />
  );
}

function percent(part: number, whole: number): string {
  return whole === 0 ? "0%" : `${Number(((part / whole) * 100).toFixed(6))}%`;
}
