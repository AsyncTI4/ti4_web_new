import React from "react";

/** A plain <img>. Everything is decoded before playback starts, so Remotion's <Img> loading and
 * buffering hooks (several per image, every frame) would buy nothing but CPU time. */
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img alt="" draggable={false} decoding="sync" {...props} />
);
