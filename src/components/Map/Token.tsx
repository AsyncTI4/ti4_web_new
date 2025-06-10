import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { getTokenImagePath } from "@/data/tokens";

interface TokenProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  tokenId: string;
  colorAlias?: string;
  faction?: string;
}

export const Token = ({
  tokenId,
  colorAlias,
  faction,
  alt,
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
        {...imageProps}
      />
    );
  }

  const imagePath = getTokenImagePath(tokenId);

  const defaultAlt = alt || `${faction || "token"} ${tokenId}`;

  return (
    <img
      src={cdnImage(`/tokens/${imagePath}`)}
      alt={defaultAlt}
      {...imageProps}
    />
  );
};

const DMZToken = ({
  tokenId,
  colorAlias,
  faction,
  alt,
  ...imageProps
}: TokenProps) => {
  const defaultAlt = alt || `${faction || "token"} ${tokenId}`;

  const existingStyle = imageProps.style || {};
  const existingLeft = existingStyle.left;

  // Parse existing left value and add 20px
  let newLeft = "20px";
  if (existingLeft) {
    const leftValue =
      typeof existingLeft === "string"
        ? parseInt(existingLeft.replace("px", "")) || 0
        : typeof existingLeft === "number"
          ? existingLeft
          : 0;
    newLeft = `${leftValue + 20}px`;
  }

  const imagePath = getTokenImagePath(tokenId);

  const dmzStyles = {
    ...existingStyle,
    width: "120px",
    left: newLeft,
  };

  return (
    <img
      src={cdnImage(`/tokens/${imagePath}`)}
      alt={defaultAlt}
      {...imageProps}
      style={dmzStyles}
    />
  );
};
