import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { getTokenImagePath } from "@/data/tokens";
import { getAttachmentImagePath } from "@/data/attachments";

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

  if (!imagePath) return null;
  return <img src={cdnImage(imagePath)} alt={defaultAlt} {...imageProps} />;
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
