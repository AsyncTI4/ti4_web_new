import React from "react";
import { cdnImage } from "../../data/cdnImage";
import {
  getAttachmentData,
  getAttachmentImagePath,
} from "../../data/attachments";

type AttachmentProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  unitType: string;
  colorAlias?: string;
  faction?: string;
};

export const Attachment = ({
  unitType,
  colorAlias,
  faction,
  alt,
  ...imageProps
}: AttachmentProps) => {
  // Look up attachment data by ID
  const attachmentData = getAttachmentData(unitType);
  const imagePath = getAttachmentImagePath(unitType);

  const defaultAlt =
    alt || `${faction || "attachment"} ${attachmentData?.name || unitType}`;

  return (
    <img
      src={cdnImage(`/attachment_token/${imagePath}`)}
      alt={defaultAlt}
      {...imageProps}
    />
  );
};
