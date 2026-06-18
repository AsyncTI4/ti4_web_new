import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import {
  getAttachmentData,
  getAttachmentImagePath,
} from "@/entities/lookup/attachments";
import { TokenSprite } from "@/shared/ui/Token/components/TokenSprite";
import { getTokenSprite } from "@/shared/ui/Token/tokenSprites";

type AttachmentProps = React.HTMLAttributes<HTMLDivElement> & {
  unitType: string;
  faction?: string;
  alt?: string;
  x?: number;
  y?: number;
  zIndex?: number;
};

export const Attachment = ({
  unitType,
  faction,
  alt,
  x,
  y,
  zIndex,
  ...imageProps
}: AttachmentProps) => {
  // Look up attachment data by ID
  const attachmentData = getAttachmentData(unitType);
  const imagePath = getAttachmentImagePath(unitType);
  const sprite = getTokenSprite("attachment", unitType);

  const defaultAlt =
    alt || `${faction || "attachment"} ${attachmentData?.name || unitType}`;

  if (!imagePath) return null;

  const style = {
    ...imageProps.style,
    position: "absolute" as const,
    left: `${x}px`,
    top: `${y}px`,
    transform: "translate(-50%, -50%)",
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
