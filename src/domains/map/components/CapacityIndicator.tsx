import { CapacityUsage } from "@/entities/data/types";
import { Unit } from "@/shared/ui/Unit";
import {
  CAPACITY_INDICATOR_HEIGHT,
  CAPACITY_INDICATOR_WIDTH,
} from "@/utils/unitPositioning/constants";
import classes from "./CapacityIndicator.module.css";

type Props = {
  x: number;
  y: number;
  capacity: CapacityUsage;
};

export function CapacityIndicator({ x, y, capacity }: Props) {
  const ignoredLabel =
    capacity.ignored > 0 ? `; ${capacity.ignored} units ignored` : "";
  const label = `${capacity.used} of ${capacity.total} capacity used${ignoredLabel}`;
  const valueLength = `${capacity.used}/${capacity.total}`.length;
  let valueSizeClass = "";
  if (valueLength >= 5) valueSizeClass = classes.denseValue;
  else if (valueLength === 4) valueSizeClass = classes.compactValue;

  return (
    <div
      className={classes.capacityContainer}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${CAPACITY_INDICATOR_WIDTH}px`,
        height: `${CAPACITY_INDICATOR_HEIGHT}px`,
      }}
      role="img"
      aria-label={label}
      title={label}
    >
      <div className={classes.carrier} aria-hidden="true">
        <Unit
          unitType="cv"
          colorAlias="gry"
          alt=""
          className={classes.carrierSprite}
          scaleSprite
          showFactionTokens={false}
        />
      </div>
      <div
        className={`${classes.capacityBadge} ${valueSizeClass}`}
        aria-hidden="true"
      >
        <span>{capacity.used}</span>
        <span className={classes.divider}>/</span>
        <span>{capacity.total}</span>
        {capacity.ignored > 0 && <sup>*</sup>}
      </div>
    </div>
  );
}
