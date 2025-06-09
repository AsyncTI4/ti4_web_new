import React from "react";
import { cdnImage } from "../../data/cdnImage";

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
  const defaultAlt = alt || `${faction || "attachment"} ${unitType}`;

  return (
    <img
      src={cdnImage(`/attachment_token/${unitType}`)}
      alt={defaultAlt}
      {...imageProps}
    />
  );
};
