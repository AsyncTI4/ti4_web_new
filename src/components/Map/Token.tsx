import React from "react";
import { cdnImage } from "../../data/cdnImage";

interface TokenProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  unitType: string;
  colorAlias?: string;
  faction?: string;
}

export const Token = ({
  unitType,
  colorAlias,
  faction,
  alt,
  ...imageProps
}: TokenProps) => {
  // Short-circuit render DMZToken for token_dmz_large.png
  // to fix some DMZ token positioning issues
  if (unitType === "token_dmz_large.png") {
    return (
      <DMZToken
        unitType={unitType}
        colorAlias={colorAlias}
        faction={faction}
        alt={alt}
        {...imageProps}
      />
    );
  }

  const defaultAlt = alt || `${faction || "token"} ${unitType}`;

  return (
    <img
      src={cdnImage(`/tokens/${unitType}`)}
      alt={defaultAlt}
      {...imageProps}
    />
  );
};

const DMZToken = ({
  unitType,
  colorAlias,
  faction,
  alt,
  ...imageProps
}: TokenProps) => {
  const defaultAlt = alt || `${faction || "token"} ${unitType}`;

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

  const dmzStyles = {
    ...existingStyle,
    width: "120px",
    left: newLeft,
  };

  return (
    <img
      src={cdnImage(`/tokens/${unitType}`)}
      alt={defaultAlt}
      {...imageProps}
      style={dmzStyles}
    />
  );
};
