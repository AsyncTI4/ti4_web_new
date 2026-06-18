import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTokenImagePath, getTokenData } from "@/entities/lookup/tokens";
import { getAttachmentImagePath } from "@/entities/lookup/attachments";
import { TokenSprite } from "@/shared/ui/Token/components/TokenSprite";
import { getTokenSprite } from "@/shared/ui/Token/tokenSprites";

interface TokenProps extends React.HTMLAttributes<HTMLDivElement> {
  tokenId: string;
  colorAlias?: string;
  faction?: string;
  alt?: string;
  planetCenter?: { x: number; y: number };
  x?: number;
  y?: number;
  zIndex?: number;
}

export const Token = ({
  tokenId,
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
        faction={faction}
        alt={alt}
        planetCenter={planetCenter}
        x={x}
        y={y}
      />
    );
  }

  const tokenImagePath = getTokenImagePath(tokenId);
  const attachmentImagePath = tokenImagePath ? null : getAttachmentImagePath(tokenId);
  const imagePath = tokenImagePath || attachmentImagePath;
  const defaultAlt = alt || `${faction || "token"} ${tokenId}`;
  const tokenData = getTokenData(tokenId);
  const scale = tokenData?.scale || 1;
  const sprite = tokenImagePath
    ? getTokenSprite("token", tokenId)
    : getTokenSprite("attachment", tokenId);

  const existingStyle = imageProps.style || {};
  const transform = [
    "translate(-50%, -50%)",
    scale !== 1 ? `scale(${scale})` : undefined,
    existingStyle.transform,
  ]
    .filter(Boolean)
    .join(" ");

  if (!imagePath) return null;

  const style = {
    ...existingStyle,
    position: "absolute" as const,
    left: `${x}px`,
    top: `${y}px`,
    transform,
    zIndex: zIndex,
  };

  if (sprite) {
    return (
      <TokenSprite
        sprite={sprite}
        alt={defaultAlt}
        {...imageProps}
        style={style}
      />
    );
  }

  return (
    <img
      src={cdnImage(imagePath)}
      alt={defaultAlt}
      {...(imageProps as React.ImgHTMLAttributes<HTMLImageElement>)}
      style={style}
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
      {...(imageProps as React.ImgHTMLAttributes<HTMLImageElement>)}
      style={dmzStyles}
    />
  );
};
