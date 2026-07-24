import type { HTMLAttributes } from "react";

import { MapViewportCenter } from "../MapViewportCenter";
import classes from "./MapViewportLoader.module.css";

export type MapViewportLoaderProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export function MapViewportLoader({
  label = "Loading",
  ...rest
}: MapViewportLoaderProps) {
  return (
    <MapViewportCenter {...rest}>
      <div className={classes.loader} role="status" aria-label={label}>
        <div className={classes.track}>
          <div className={classes.sweep} />
        </div>
        <span className={classes.label}>{label}</span>
      </div>
    </MapViewportCenter>
  );
}
