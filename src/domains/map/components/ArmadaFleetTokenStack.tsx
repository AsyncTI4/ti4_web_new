import { cdnImage } from "@/entities/data/cdnImage";
import { FLEET_TOKEN_STEP, FleetTokenStackBase } from "./FleetTokenStackBase";

const ARMADA_BONUS = 2;

type ArmadaFleetTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
};

export function ArmadaFleetTokenStack({
  count,
  colorAlias,
  faction,
}: ArmadaFleetTokenStackProps) {
  const totalCount = count + ARMADA_BONUS;

  return (
    <FleetTokenStackBase
      label={`${totalCount}*`}
      baseCount={count}
      colorAlias={colorAlias}
      faction={faction}
      showBlankToken={count === 0}
      extraTokens={Array.from({ length: ARMADA_BONUS }, (_, index) => (
        <div
          key={`armada-fleet-token-${index}`}
          style={{
            position: "absolute",
            left: (count + 1 + index) * FLEET_TOKEN_STEP,
            zIndex: count + index + 1,
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
    />
  );
}
