import { cdnImage } from "@/data/cdnImage";
import classes from "../MapTile.module.css";

type Props = {
  show: boolean;
  width: number;
  height: number;
};

export function AnomalyOverlay({ show, width, height }: Props) {
  if (!show) return null;
  return (
    <img
      src={cdnImage("/emojis/tiles/Anomaly.png")}
      alt="Anomaly"
      className={classes.anomalyOverlay}
      style={{ width, height }}
    />
  );
}
