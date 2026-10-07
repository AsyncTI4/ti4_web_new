import type { CapacityUsage } from "@/entities/data/types";
import { findSystemIndicatorLayout } from "@/entities/positioning";
import { CapacityIndicator } from "../CapacityIndicator";
import { ProductionIndicator } from "../ProductionIndicator";

type Props = {
  systemId: string;
  highestProduction: number;
  largestCapacity?: CapacityUsage;
  hasBorderAnomaly: boolean;
};

export function SystemIndicatorsLayer({
  systemId,
  highestProduction,
  largestCapacity,
  hasBorderAnomaly,
}: Props) {
  const layout = findSystemIndicatorLayout(systemId, hasBorderAnomaly);
  const hasProduction = highestProduction > 0;
  const capacityPlacement = hasProduction
    ? layout.capacity.withProduction
    : layout.capacity.solo;

  return (
    <>
      {hasProduction && (
        <ProductionIndicator
          x={layout.production.x}
          y={layout.production.y}
          productionValue={highestProduction}
        />
      )}
      {largestCapacity && largestCapacity.total > 0 && (
        <CapacityIndicator
          x={capacityPlacement.x}
          y={capacityPlacement.y}
          capacity={largestCapacity}
        />
      )}
    </>
  );
}
