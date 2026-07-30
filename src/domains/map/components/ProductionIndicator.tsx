import { cdnImage } from "@/entities/data/cdnImage";
import { PRODUCTION_INDICATOR_SIZE } from "@/utils/unitPositioning/constants";
import classes from "./ProductionIndicator.module.css";

type Props = {
  x: number;
  y: number;
  productionValue: number;
};

export const ProductionIndicator = ({ x, y, productionValue }: Props) => {
  return (
    <div
      className={classes.productionContainer}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${PRODUCTION_INDICATOR_SIZE}px`,
        height: `${PRODUCTION_INDICATOR_SIZE}px`,
      }}
    >
      <img
        src={cdnImage("/tiles/production_representation.png")}
        alt="Production"
        className={classes.productionIcon}
      />
      <div className={classes.productionValue}>{productionValue}</div>
    </div>
  );
};
