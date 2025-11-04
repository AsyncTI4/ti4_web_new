import React from "react";
import classes from "./VoidTetherIndicator.module.css";
import { cdnImage } from "@/data/cdnImage";

type Props = {
  x: number;
  y: number;
  edge: number;
};

export const VoidTetherIndicator: React.FC<Props> = ({
  x,
  y,
  edge
}) => {

  // 0 is the topmost, then goes clockwise.
  const angle = edge === 0 ?
    classes.rotateNone
    : edge === 1 ?
    classes.rotateRight
    : classes.rotateLeft;

  return (
    <div
      className={`${classes.tetherIndicator} ${angle}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <img
        src={cdnImage(`/borders/void_tether.png`)}
        alt="Void Tether"
      />
    </div>
  );
};