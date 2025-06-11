import React from "react";
import { cdnImage } from "../../data/cdnImage";

interface UnitProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  unitType: string;
  colorAlias: string;
  faction?: string;
  sustained?: boolean;
}

export const Unit: React.FC<UnitProps> = ({
  unitType,
  colorAlias,
  faction,
  alt,
  sustained,
  ...imageProps
}) => {
  const defaultAlt = alt || `${faction || colorAlias} ${unitType}`;

  return (
    <>
      <img
        src={cdnImage(`/units/${colorAlias}_${unitType}.png`)}
        alt={defaultAlt}
        {...imageProps}
      />
      {sustained && (
        <img
          src={cdnImage(`/extra/marker_damage.png`)}
          alt={defaultAlt}
          {...imageProps}
        />
      )}
    </>
  );
};
