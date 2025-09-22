import React from "react";
import { cdnImage } from "../../data/cdnImage";
import { getFactionImage } from "@/lookup/factions";
import { useFactionImages } from "@/hooks/useFactionImages";

type CommandCounterProps = {
  colorAlias: string;
  faction?: string;
  style?: React.CSSProperties;
  type?: "command" | "fleet";
};

export const CommandCounter = ({
  colorAlias,
  faction,
  style,
  type = "command",
}: CommandCounterProps) => {
  const factionImages = useFactionImages();
  const factionImage = factionImages[faction!]?.image;
  const factionImageType = factionImages[faction!]?.type;
  const factionUrl = getFactionImage(faction!, factionImage, factionImageType);
  return (
    <div style={style}>
      <div style={{ position: "relative" }}>
        <img
          src={cdnImage(`/command_token/${type}_${colorAlias}.png`)}
          alt={`${faction || type} ${type} token`}
        />
        {faction && type === "command" && (
          <img
            src={factionUrl}
            alt={`${faction} faction`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -30%)",
              height: "45px",
              zIndex: 1,
            }}
          />
        )}
      </div>
    </div>
  );
};
