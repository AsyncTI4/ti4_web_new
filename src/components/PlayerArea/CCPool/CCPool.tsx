import { StatGroup } from "@/components/shared/primitives/StatGroup";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
};

export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
}: Props) {
  const fleetValue = fleetCC + mahactEdict.length;
  const fleetSuffix = mahactEdict.length > 0 ? "*" : "";

  return (
    <StatGroup
      size="lg"
      items={[
        { value: tacticalCC, label: "TAC" },
        { value: fleetValue, label: "FLT", suffix: fleetSuffix },
        { value: strategicCC, label: "STR" },
      ]}
    />
  );
}
