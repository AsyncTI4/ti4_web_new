import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { getFactionImage } from "@/lookup/factions";
import { useFactionImages } from "@/hooks/useFactionImages";

type ControlTokenProps = {
  colorAlias: string;
  faction?: string;
  style?: React.CSSProperties;
};

export const ControlToken = ({
  colorAlias,
  faction,
  style,
}: ControlTokenProps) => {
  const factionImages = useFactionImages();
  const factionImage = factionImages[faction!]?.image;
  const factionImageType = factionImages[faction!]?.type;
  const factionUrl = getFactionImage(faction!, factionImage, factionImageType);
  return (
    <div style={style}>
      <div style={{ position: "relative" }}>
        <img
          src={cdnImage(`/command_token/control_${colorAlias}.png`)}
          alt={`${faction || "control"} control token`}
        />
        {faction && (
          <img
            src={factionUrl}
            alt={`${faction} faction`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -55%)",
              height: "40px",
              zIndex: 1,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const SmallControlToken = ({
  colorAlias,
  faction,
  style,
}: ControlTokenProps) => {
  const factionImages = useFactionImages();
  const factionImage = factionImages[faction!]?.image;
  const factionImageType = factionImages[faction!]?.type;
  const factionUrl = getFactionImage(faction!, factionImage, factionImageType);
  return (
    <div style={style}>
      <div style={{ position: "relative", height: "24px" }}>
        <img
          src={cdnImage(`/command_token/control_${colorAlias}.png`)}
          alt={`${faction || "control"} control token`}
          style={{ height: "24px" }}
        />
        {faction && (
          <img
            src={factionUrl}
            alt={`${faction} faction`}
            style={{
              position: "absolute",
              marginTop: "4px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -70%)",
              height: "20px",
              zIndex: 1,
            }}
          />
        )}
      </div>
    </div>
  );
};
