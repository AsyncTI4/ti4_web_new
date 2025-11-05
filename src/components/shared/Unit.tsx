import React from "react";
import { LawInPlay } from "../../data/types";
import {
  isFighterOrInfantry,
  computeDefaultAlt,
  computeUrlColor,
  computeTokenSuffix,
} from "./Unit/utils";
import { BackgroundDecal } from "./Unit/components/BackgroundDecal";
import { BaseUnitImage } from "./Unit/components/BaseUnitImage";
import { PlayerDecalOverlay } from "./Unit/overlays/PlayerDecalOverlay";
import { LawOverlay } from "./Unit/overlays/LawOverlay";
import { DamageMarker } from "./Unit/overlays/DamageMarker";
import { cdnImage } from "@/data/cdnImage";

type UnitProps = {
  unitType: string;
  colorAlias: string;
  faction?: string;
  sustained?: boolean;
  bgDecalPath?: string;
  decalPath?: string;
  lawsInPlay?: LawInPlay[];
  galvanized?: boolean;
  x?: number;
  y?: number;
  zIndex?: number;
  alt?: string;
  className?: string;
};

export function Unit({
  unitType,
  colorAlias,
  faction,
  alt,
  sustained,
  bgDecalPath,
  decalPath,
  lawsInPlay,
  galvanized,
  x,
  y,
  zIndex,
  className,
}: UnitProps) {
  const defaultAlt = computeDefaultAlt(alt, faction, colorAlias, unitType);
  const tokenSuffix = computeTokenSuffix(colorAlias);
  const urlColor = computeUrlColor(unitType, colorAlias);
  const fighterOrInfantry = isFighterOrInfantry(unitType);

  const isArticlesOfWarActive = lawsInPlay?.some(
    (law) => law.id === "articles_war"
  );
  const isSchematicsActive = lawsInPlay?.some((law) => law.id === "schematics");
  const showArticles = isArticlesOfWarActive && unitType === "mf";
  const showSchematics = isSchematicsActive && unitType === "ws";

  const isPositioned = x !== undefined && y !== undefined;

  return (
    <div
      style={{
        ...(isPositioned
          ? {
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
              zIndex: zIndex,
            }
          : {
              position: "relative",
            }),
      }}
    >
      <BackgroundDecal path={bgDecalPath} />
      <BaseUnitImage
        urlColor={urlColor}
        unitType={unitType}
        alt={defaultAlt}
        className={className}
      />
      <PlayerDecalOverlay path={decalPath} disabled={fighterOrInfantry} />
      {showArticles && (
        <LawOverlay
          tokenPath={`/tokens/agenda_articles_of_war${tokenSuffix}.png`}
          alt={`${defaultAlt} articles of war`}
          zIndexDelta={1}
        />
      )}
      {showSchematics && (
        <LawOverlay
          tokenPath={`/tokens/agenda_publicize_weapon_schematics${tokenSuffix}.png`}
          alt={`${defaultAlt} weapon schematics`}
          zIndexDelta={1}
        />
      )}

      <DamageMarker show={sustained} alt={defaultAlt} />

      {galvanized && (
        <GalvanizeMarker
          alt="Galvanize Marker"
          zIndex={zIndex ? zIndex + 1 : undefined}
          unitType={unitType}
        />
      )}
    </div>
  );
}

type GalvanizeMarkerProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
  zIndex?: number;
  unitType: string;
};

function GalvanizeMarker({ alt, zIndex, unitType }: GalvanizeMarkerProps) {
  const styles =
    unitType === "mf"
      ? {
          right: "0%",
          top: "25%",
        }
      : {
          left: "70%",
          top: "30%",
        };
  return (
    <img
      src={cdnImage("/extra/marker_galvanize.png")}
      alt={alt}
      style={{
        position: "absolute",
        ...styles,
        transform: "translate(-50%, -50%)",
        width: "28px",
        zIndex: zIndex ? zIndex + 10000 : undefined,
      }}
    />
  );
}
