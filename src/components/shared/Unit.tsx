import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { LawInPlay } from "../../data/types";
import { getTextColor } from "../../lookup/colors";

interface UnitProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  unitType: string;
  colorAlias: string;
  faction?: string;
  sustained?: boolean;
  bgDecalPath?: string;
  lawsInPlay?: LawInPlay[];
}

export const Unit: React.FC<UnitProps> = ({
  unitType,
  colorAlias,
  faction,
  alt,
  sustained,
  bgDecalPath,
  lawsInPlay,
  ...imageProps
}) => {
  const defaultAlt = alt || `${faction || colorAlias} ${unitType}`;

  // Check for law overlays
  const isArticlesOfWarActive = lawsInPlay?.some(
    (law) => law.id === "articles_war"
  );
  const isSchematicsActive = lawsInPlay?.some((law) => law.id === "schematics");
  const isMech = unitType === "mf";
  const isWarSun = unitType === "ws";

  const shouldShowArticlesOverlay = isArticlesOfWarActive && isMech;
  const shouldShowSchematicsOverlay = isSchematicsActive && isWarSun;

  // Determine token color based on text color
  const textColor = getTextColor(colorAlias);
  const tokenSuffix = textColor.toLowerCase() === "white" ? "_wht" : "_blk";

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

      {shouldShowArticlesOverlay && (
        <img
          src={cdnImage(`/tokens/agenda_articles_of_war${tokenSuffix}.png`)}
          alt={`${defaultAlt} articles of war`}
          {...imageProps}
          style={{
            ...imageProps.style,
            position: "absolute",
            zIndex: (imageProps.style?.zIndex as number) + 1 || 1,
          }}
        />
      )}
      {shouldShowSchematicsOverlay && (
        <img
          src={cdnImage(
            `/tokens/agenda_publicize_weapon_schematics${tokenSuffix}.png`
          )}
          alt={`${defaultAlt} weapon schematics`}
          {...imageProps}
          style={{
            ...imageProps.style,
            position: "absolute",
            zIndex: (imageProps.style?.zIndex as number) + 1 || 1,
          }}
        />
      )}
      {sustained && (
        <img
          src={cdnImage(`/extra/marker_damage.png`)}
          alt={defaultAlt}
          {...imageProps}
          style={{
            ...imageProps.style,
            position: "absolute",
            zIndex: (imageProps.style?.zIndex as number) + 2 || 2,
          }}
        />
      )}
    </>
  );
};
