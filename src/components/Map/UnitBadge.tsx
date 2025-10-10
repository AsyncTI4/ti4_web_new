import React from "react";
import { cdnImage } from "@/data/cdnImage";
import { getUnitZIndex } from "../../utils/zIndexLayers";
import classes from "./UnitBadge.module.css";
import cx from "clsx";

interface UnitBadgeProps {
  unitType: "ff" | "gf";
  colorAlias: string;
  textColor: string;
  faction: string;
  count: number;
  style?: React.CSSProperties;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function UnitBadge({
  unitType,
  colorAlias,
  textColor,
  faction,
  count,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
}: UnitBadgeProps) {
  const baseZIndex = getUnitZIndex(unitType, 0);
  const mergedStyle = {
    ...style,
    zIndex: baseZIndex,
  };

  const isWhiteText = textColor.toLowerCase() === "white";

  return (
    <div
      style={mergedStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
    >
      <div className={classes.unitBadge}>
        <img
          src={cdnImage(`/units/${colorAlias}_tkn_${unitType}.png`)}
          alt={`${faction} ${unitType}`}
          className={classes.unitIcon}
        />
        <div className={classes.unitCountContainer}>
          <span
            className={cx(classes.unitCount, isWhiteText && classes.whiteText)}
            style={{ color: textColor }}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
