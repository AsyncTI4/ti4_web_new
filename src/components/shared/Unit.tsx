import React from "react";
import { cdnImage } from "../../data/cdnImage";

interface UnitProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  unitType: string;
  colorAlias: string;
  faction?: string;
  sustained?: boolean;
  bgDecalPath?: string;
}

export const Unit: React.FC<UnitProps> = ({
  unitType,
  colorAlias,
  faction,
  alt,
  sustained,
  bgDecalPath,
  ...imageProps
}) => {
  const defaultAlt = alt || `${faction || colorAlias} ${unitType}`;

  return (
    <>
      {bgDecalPath && (
        <img
          src={cdnImage(`/decals/${bgDecalPath}`)}
          alt={`${defaultAlt} background decal`}
          {...imageProps}
          style={{
            ...imageProps.style,
            zIndex: (imageProps.style?.zIndex as number) - 1 || -1,
          }}
        />
      )}
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
