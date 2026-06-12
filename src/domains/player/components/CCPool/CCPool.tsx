import { StatGroup } from "@/shared/ui/primitives/StatGroup";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
  layout?: "horizontal" | "vertical";
};

export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
  layout = "vertical",
}: Props) {
  const fleetValue = fleetCC + mahactEdict.length;
  const fleetSuffix = mahactEdict.length > 0 ? "*" : "";

  return (
    <StatGroup
      size={layout === "horizontal" ? "md" : "lg"}
      layout={layout}
      gap={layout === "horizontal" ? 10 : 0}
      items={[
        { value: tacticalCC, label: "TAC" },
        { value: fleetValue, label: "FLT", suffix: fleetSuffix },
        { value: strategicCC, label: "STR" },
      ]}
    />
  );
}
