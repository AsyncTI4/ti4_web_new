import React from "react";
import { cdnImage } from "../../data/cdnImage";

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
  return (
    <div style={style}>
      <div style={{ position: "relative" }}>
        <img
          src={cdnImage(`/command_token/control_${colorAlias}.png`)}
          alt={`${faction || "control"} control token`}
        />
        {faction && (
          <img
            src={cdnImage(`/factions/${faction}.png`)}
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
            src={cdnImage(`/factions/${faction}.png`)}
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
