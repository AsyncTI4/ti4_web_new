import React from "react";
import { cdnImage } from "../../data/cdnImage";

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
  return (
    <div style={style}>
      <div style={{ position: "relative" }}>
        <img
          src={cdnImage(`/command_token/${type}_${colorAlias}.png`)}
          alt={`${faction || type} ${type} token`}
        />
        {faction && type === "command" && (
          <img
            src={cdnImage(`/factions/${faction}.png`)}
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
