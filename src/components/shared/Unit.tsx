import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { LawInPlay } from "../../data/types";
import { getTextColor, findColorData } from "../../lookup/colors";

interface UnitProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  unitType: string;
  colorAlias: string;
  faction?: string;
  sustained?: boolean;
  bgDecalPath?: string;
  decalPath?: string; // Decal overlay path (from player's active decal)
  lawsInPlay?: LawInPlay[];
}

export const Unit: React.FC<UnitProps> = ({
  unitType,
  colorAlias,
  faction,
  alt,
  sustained,
  bgDecalPath,
  decalPath,
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
  const isFighterOrInfantry = unitType === "ff" || unitType === "gf";

  const shouldShowArticlesOverlay = isArticlesOfWarActive && isMech;
  const shouldShowSchematicsOverlay = isSchematicsActive && isWarSun;

  const textColor = getTextColor(colorAlias);
  const tokenSuffix = textColor.toLowerCase() === "white" ? "_wht" : "_blk";
  const urlColor =
    unitType === "monument" || unitType === "lady"
      ? findColorData(colorAlias)?.name || colorAlias
      : colorAlias;

  return (
    <>
      {bgDecalPath && (
        <img
          src={cdnImage(`/decals/${bgDecalPath}`)}
          {...imageProps}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          style={{
            ...imageProps.style,
            zIndex: (imageProps.style?.zIndex as number) - 1 || -1,
          }}
        />
      )}
      <img
        src={cdnImage(`/units/${urlColor}_${unitType}.png`)}
        alt={defaultAlt}
        {...imageProps}
      />
      {/* Decal overlay - only show for non-fighter/infantry units */}
      {decalPath && !isFighterOrInfantry && (
        <img
          src={cdnImage(`/decals/${decalPath}`)}
          {...imageProps}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          style={{
            ...imageProps.style,
            position: "absolute",
            zIndex: (imageProps.style?.zIndex as number) || 0,
          }}
        />
      )}
      {shouldShowArticlesOverlay && (
        <img
          src={cdnImage(`/tokens/agenda_articles_war${tokenSuffix}.png`)}
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
