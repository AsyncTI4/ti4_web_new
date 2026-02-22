import { getColorAlias } from "@/entities/lookup/colors";
import { FleetTokenStackBase } from "./FleetTokenStackBase";
import { CommandCounter } from "./CommandCounter";

type MahactFleetTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
  mahactEdict?: string[];
};

export function MahactFleetTokenStack({
  count,
  colorAlias,
  faction,
  mahactEdict = [],
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
      renderExtraTokens={({ baseCount }) =>
        mahactEdict.map((edictColor, index) => {
          const edictColorAlias = getColorAlias(edictColor);

          return (
            <CommandCounter
              key={`mahact-edict-${edictColor}-${index}`}
              colorAlias={edictColorAlias}
              style={{
                position: "absolute",
                left: baseCount * 20 + (baseCount === 0 ? 0 : 20) + index * 20,
                zIndex: baseCount + index + 1,
              }}
              type="fleet"
            />
          );
        })
      }
    />
  );
}
