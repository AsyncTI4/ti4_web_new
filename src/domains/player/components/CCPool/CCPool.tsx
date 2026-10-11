import { StatGroup } from "@/shared/ui/primitives/StatGroup";
import styles from "./CCPool.module.css";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
  layout?: "horizontal" | "vertical";
};

/** Command pool: three equal gauges divided by hairlines when horizontal. */
export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
  layout = "vertical",
}: Props) {
  const fleetValue = fleetCC + mahactEdict.length;
  const fleetSuffix = mahactEdict.length > 0 ? "*" : "";
  const items = [
    { value: tacticalCC, label: "TAC", suffix: "" },
    { value: fleetValue, label: "FLT", suffix: fleetSuffix },
    { value: strategicCC, label: "STR", suffix: "" },
  ];

  if (layout === "vertical") {
    return <StatGroup size="lg" layout="vertical" gap={0} items={items} />;
  }

  return (
    <div className={styles.ccs}>
      {items.map((item) => (
        <span key={item.label} title={`${item.value}${item.suffix} ${item.label}`}>
          <b>
            {item.value}
            {item.suffix}
          </b>
          <em>{item.label}</em>
        </span>
      ))}
    </div>
  );
}
