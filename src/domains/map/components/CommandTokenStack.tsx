import { FleetTokenStackBase } from "./FleetTokenStackBase";
import { ArmadaFleetTokenStack } from "./ArmadaFleetTokenStack";
import { MahactFleetTokenStack } from "./MahactFleetTokenStack";

type CommandTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
  type: "command" | "fleet";
  mahactEdict?: string[];
  hasArmadaBonus?: boolean;
};

export function CommandTokenStack({
  count,
  colorAlias,
  faction,
  type,
  mahactEdict = [],
  hasArmadaBonus = false,
}: CommandTokenStackProps) {
  if (type === "fleet") {
    if (hasArmadaBonus) {
      return (
        <ArmadaFleetTokenStack
          count={count}
          colorAlias={colorAlias}
          faction={faction}
        />
      );
    }

    if (mahactEdict.length > 0) {
      return (
        <MahactFleetTokenStack
          count={count}
          colorAlias={colorAlias}
          faction={faction}
          mahactEdict={mahactEdict}
        />
      );
    }
  }

  return (
    <FleetTokenStackBase
      label={count}
      baseCount={count}
      colorAlias={colorAlias}
      faction={faction}
      counterType={type}
      showBlankToken={count === 0}
    />
  );
}
