import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTokenImagePath, getTokenData } from "@/entities/lookup/tokens";
import { getAttachmentImagePath } from "@/entities/lookup/attachments";

interface TokenProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  tokenId: string;
  colorAlias?: string;
  faction?: string;
  planetCenter?: { x: number; y: number };
  x?: number;
  y?: number;
  zIndex?: number;
}

export const Token = ({
  tokenId,
  colorAlias,
  faction,
  alt,
  planetCenter,
  x,
  y,
  zIndex,
  ...imageProps
}: TokenProps) => {
  // Short-circuit render DMZToken for token_dmz_large.png
  // to fix some DMZ token positioning issues
  if (tokenId === "dmz_large") {
    return (
      <DMZToken
        tokenId={tokenId}
        colorAlias={colorAlias}
        faction={faction}
        alt={alt}
        planetCenter={planetCenter}
        x={x}
        y={y}
      />
    );
  }

  const imagePath =
    getTokenImagePath(tokenId) || getAttachmentImagePath(tokenId);
  const defaultAlt = alt || `${faction || "token"} ${tokenId}`;
  const tokenData = getTokenData(tokenId);
  const scale = tokenData?.scale || 1;

  const existingStyle = imageProps.style || {};
  const scaledStyle =
    scale !== 1
      ? {
          ...existingStyle,
          transform: `${existingStyle.transform || ""} scale(${scale})`.trim(),
        }
      : existingStyle;

  if (!imagePath) return null;
  return (
    <img
      src={cdnImage(imagePath)}
      alt={defaultAlt}
      {...imageProps}
      style={{
        ...scaledStyle,
        position: "absolute" as const,
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: zIndex,
      }}
    />
  );
};

const DMZToken = ({
  tokenId,
  faction,
  alt,
  planetCenter,
  x,
  y,
  ...imageProps
}: TokenProps) => {
  const defaultAlt = alt || `${faction || "token"} ${tokenId}`;
  const existingStyle = imageProps.style || {};
  let dmzStyles;
  if (planetCenter) {
    // If planetCenter is provided, render dead center
    dmzStyles = {
      ...existingStyle,
      width: "120px",
      position: "absolute" as const,
      left: `${planetCenter.x}px`,
      top: `${planetCenter.y}px`,
      transform: "translate(-25%, -25%)",
      zIndex: 1000,
    };
  } else {
    // Otherwise, use attachment x,y location with no nudging
    dmzStyles = {
      ...existingStyle,
      width: "120px",
      position: "absolute" as const,
      left: `${x}px`,
      top: `${y}px`,
      transform: "translate(-50%, -50%)",
    };
  }

  const imagePath =
    getTokenImagePath(tokenId) || getAttachmentImagePath(tokenId);

  if (!imagePath) return null;
  return (
    <img
      src={cdnImage(imagePath)}
      alt={defaultAlt}
      {...imageProps}
      style={dmzStyles}
    />
  );
};
