import React from "react";
import { cdnImage } from "../../../../data/cdnImage";

type BackgroundDecalProps = {
  path?: string;
};

export function BackgroundDecal(
  props: BackgroundDecalProps
): React.ReactElement | null {
  const { path } = props;
  if (!path) return null;
  return (
    <img
      src={cdnImage(`/decals/${path}`)}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
      }}
    />
  );
}


