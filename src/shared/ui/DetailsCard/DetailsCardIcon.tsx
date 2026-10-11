import type { CSSProperties, ReactNode } from "react";
import cx from "clsx";
import classes from "./DetailsCard.module.css";

export type DetailsCardIconShape =
  | "square"
  | "leader"
  | "secret"
  | "tech"
  | "pn"
  | "relic"
  | "planet"
  | "round"
  | "sc"
  | "card"
  | "unit"
  | "capsule";

type Props = {
  icon: ReactNode;
  /** The object's silhouette, so the popover still says what was clicked. */
  shape?: DetailsCardIconShape;
  /** A small mark on the tile's corner, such as the owning faction. */
  badge?: ReactNode;
  style?: CSSProperties;
};

function DetailsCardIcon({ icon, shape = "square", badge, style }: Props) {
  return (
    <span className={cx(classes.tile, classes[`tile_${shape}`])} style={style}>
      {icon}
      {badge && <span className={classes.badge}>{badge}</span>}
    </span>
  );
}

export default DetailsCardIcon;
