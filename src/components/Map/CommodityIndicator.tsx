import React from "react";
import { DEFAULT_PLANET_RADIUS } from "../../utils/unitPositioning";
import classes from "./CommodityIndicator.module.css";

type Props = {
  commodityCount: number;
  x: number;
  y: number;
};

export const CommodityIndicator: React.FC<Props> = ({
  commodityCount,
  x,
  y,
}) => {
  // Position on bottom right of planet circle using trigonometry
  // Bottom right is 45 degrees (π/4 radians) from center
  const angle = Math.PI / 4;
  const offsetX = DEFAULT_PLANET_RADIUS * Math.cos(angle);
  const offsetY = DEFAULT_PLANET_RADIUS * Math.sin(angle);

  return (
    <div
      className={classes.commodityIndicator}
      style={{
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
      }}
    >
      <img
        src="/comms.png"
        alt="Commodities"
        className={classes.commodityIcon}
      />
      <div className={classes.commodityCount}>{commodityCount}</div>
    </div>
  );
};
