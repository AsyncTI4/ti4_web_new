import { getColorAlias } from "@/entities/lookup/colors";
import { FLEET_TOKEN_STEP, FleetTokenStackBase } from "./FleetTokenStackBase";
import { CommandCounter } from "./CommandCounter";

type MahactFleetTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
  mahactEdict: string[];
};

export function MahactFleetTokenStack({
  count,
  colorAlias,
  faction,
  mahactEdict,
}: MahactFleetTokenStackProps) {
  const totalCount = count + mahactEdict.length;
  const hasEdict = mahactEdict.length > 0;

  return (
    <FleetTokenStackBase
      label={`${totalCount}${hasEdict ? "*" : ""}`}
      baseCount={count}
      colorAlias={colorAlias}
      faction={faction}
      showBlankToken={totalCount === 0}
      extraTokens={mahactEdict.map((edictColor, index) => (
        <CommandCounter
          key={`mahact-edict-${edictColor}-${index}`}
          colorAlias={getColorAlias(edictColor)}
          style={{
            position: "absolute",
            left: (count + (count === 0 ? 0 : 1) + index) * FLEET_TOKEN_STEP,
            zIndex: count + index + 1,
          }}
          type="fleet"
        />
      ))}
    />
  );
}
