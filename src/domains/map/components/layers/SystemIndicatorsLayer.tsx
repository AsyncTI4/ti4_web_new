import React from "react";
import { CapacityUsage } from "@/entities/data/types";
import { findSystemIndicatorLayout } from "@/utils/unitPositioning";
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
  const layout = React.useMemo(
    () => findSystemIndicatorLayout(systemId, hasBorderAnomaly),
    [hasBorderAnomaly, systemId],
  );
  const hasProduction = highestProduction > 0;
  const capacityPlacement = hasProduction
    ? layout.capacity.withProduction
    : layout.capacity.solo;

  return (
    <>
      {hasProduction && (
        <ProductionIndicator
          key={`${systemId}-production-icon`}
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
