import React from "react";
import { ProductionIndicator } from "../ProductionIndicator";
import { findOptimalProductionIconCorner } from "@/utils/unitPositioning";

type Props = {
  systemId: string;
  highestProduction: number;
};

export function ProductionIconLayer({ systemId, highestProduction }: Props) {
  const icon = React.useMemo(() => {
    if (highestProduction <= 0) return null;

    const optimalCorner = findOptimalProductionIconCorner(systemId);

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
