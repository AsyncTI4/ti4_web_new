import { cdnImage } from "@/entities/data/cdnImage";
import { FleetTokenStackBase } from "./FleetTokenStackBase";

type LetnevFleetTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
};

export function LetnevFleetTokenStack({
  count,
  colorAlias,
  faction,
}: LetnevFleetTokenStackProps) {
  const totalCount = count + 2; // Always add 2 for Letnev

  return (
    <FleetTokenStackBase
      label={`${totalCount}*`}
      baseCount={count}
      colorAlias={colorAlias}
      faction={faction}
      showBlankToken={count === 0}
      renderExtraTokens={({ baseCount }) => (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`letnev-armada-${index}`}
              style={{
                position: "absolute",
                left: baseCount * 20 + 20 + index * 20,
                zIndex: baseCount + index + 1,
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={cdnImage(`/command_token/fleet_${colorAlias}.png`)}
                  alt={`${faction} armada fleet token`}
                />
                <img
                  src={cdnImage("/command_token/fleet_armada.png")}
                  alt="armada"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -30%)",
                    height: "45px",
                    zIndex: 1,
                  }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    />
  );
}
