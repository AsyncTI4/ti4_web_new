import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { getTokenImagePath, getTokenData } from "@/lookup/tokens";
import { getAttachmentImagePath } from "@/lookup/attachments";

interface TokenProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  tokenId: string;
  colorAlias?: string;
  faction?: string;
  planetCenter?: { x: number; y: number };
}

export const Token = ({
  tokenId,
  colorAlias,
  faction,
  alt,
  planetCenter,
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
        {...imageProps}
      />
    );
  }

  const imagePath =
    getTokenImagePath(tokenId) || getAttachmentImagePath(tokenId);

  const defaultAlt = alt || `${faction || "token"} ${tokenId}`;

  // Get token data to check for scale
  const tokenData = getTokenData(tokenId);
  const scale = tokenData?.scale || 1;

  // Apply scale to the existing style
  const existingStyle = imageProps.style || {};
  const scaledStyle =
    scale !== 1
      ? {
          ...existingStyle,
          transform: existingStyle.transform
            ? `${existingStyle.transform} scale(${scale})`
            : `scale(${scale})`,
        }
      : existingStyle;

  if (!imagePath) return null;
  return (
    <img
      src={cdnImage(imagePath)}
      alt={defaultAlt}
      {...imageProps}
      style={scaledStyle}
    />
  );
};

const DMZToken = ({
  tokenId,
  colorAlias,
  faction,
  alt,
  planetCenter,
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
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
    };
  } else {
    // Otherwise, use attachment x,y location with no nudging
    dmzStyles = {
      ...existingStyle,
      width: "120px",
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
