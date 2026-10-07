import { cdnImage } from "@/entities/data/cdnImage";
import { getUnitZIndex } from "@/utils/zIndexLayers";
import { SpriteUnitImage } from "@/shared/ui/Unit/components/SpriteUnitImage";
import { getUnitSprite } from "@/shared/ui/Unit/unitSprites";
import classes from "./UnitBadge.module.css";
import cx from "clsx";

type UnitBadgeProps = {
  unitType: "ff" | "gf";
  colorAlias: string;
  textColor: string;
  faction: string;
  count: number;
};

export function UnitBadge({
  unitType,
  colorAlias,
  textColor,
  faction,
  count,
}: UnitBadgeProps) {
  const isWhiteText = textColor.toLowerCase() === "white";
  const sprite = getUnitSprite(colorAlias, `tkn_${unitType}`);

  return (
    <div style={{ zIndex: getUnitZIndex(unitType, 0) }}>
      <div className={classes.unitBadge}>
        {sprite ? (
          <SpriteUnitImage
            sprite={sprite}
            alt={`${faction} ${unitType}`}
            className={classes.unitIcon}
          />
        ) : (
          <img
            src={cdnImage(`/units/${colorAlias}_tkn_${unitType}.png`)}
            alt={`${faction} ${unitType}`}
            className={classes.unitIcon}
          />
        )}
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
