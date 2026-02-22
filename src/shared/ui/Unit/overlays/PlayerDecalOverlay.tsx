import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";

type PlayerDecalOverlayProps = {
  path?: string;
  disabled: boolean;
};

export function PlayerDecalOverlay(
  props: PlayerDecalOverlayProps
): React.ReactElement | null {
  const { path, disabled } = props;
  if (!path || disabled) return null;
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
