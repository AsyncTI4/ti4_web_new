import React from "react";
import { cdnImage } from "../../../../data/cdnImage";

type LawOverlayProps = {
  tokenPath: string;
  alt: string;
  zIndexDelta: number;
};

export function LawOverlay(props: LawOverlayProps): React.ReactElement {
  const { tokenPath, alt } = props;
  return (
    <img
      src={cdnImage(tokenPath)}
      alt={alt}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
      }}
    />
  );
}

