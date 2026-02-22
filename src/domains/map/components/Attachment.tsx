import React from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import {
  getAttachmentData,
  getAttachmentImagePath,
} from "@/entities/lookup/attachments";

type AttachmentProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  unitType: string;
  faction?: string;
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

  const defaultAlt =
    alt || `${faction || "attachment"} ${attachmentData?.name || unitType}`;

  if (!imagePath) return null;
  return (
    <img
      src={cdnImage(imagePath)}
      alt={defaultAlt}
      {...imageProps}
      style={{
        ...imageProps.style,
        position: "absolute" as const,
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: zIndex,
      }}
    />
  );
};
