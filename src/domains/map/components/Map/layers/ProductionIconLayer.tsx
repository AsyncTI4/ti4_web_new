import React from "react";
import { ProductionIndicator } from "../ProductionIndicator";
import { findOptimalProductionIconCorner } from "@/utils/unitPositioning";

type Props = {
  systemId: string;
  highestProduction: number;
};

export function ProductionIconLayer({ systemId, highestProduction }: Props) {
  const icon = React.useMemo(() => {
    const optimalCorner = findOptimalProductionIconCorner(systemId);
    if (!optimalCorner || highestProduction <= 0) return null;

    return (
      <ProductionIndicator
        key={`${systemId}-production-icon`}
        x={optimalCorner.x}
        y={optimalCorner.y}
        productionValue={highestProduction}
      />
    );
  }, [systemId, highestProduction]);

  return icon;
}
