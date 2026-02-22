import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";

type DamageMarkerProps = {
  show: boolean | undefined;
  alt: string;
};

export function DamageMarker(
  props: DamageMarkerProps
): React.ReactElement | null {
  const { show, alt } = props;
  if (!show) return null;
  return (
    <img
      src={cdnImage(`/extra/marker_damage.png`)}
      alt={alt}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
