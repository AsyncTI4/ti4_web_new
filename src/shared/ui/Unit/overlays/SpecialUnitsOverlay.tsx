import React from "react";
import { SPECIAL_UNIT_SPRITES, SPECIAL_FACTION_SPRITES } from "../unitSprites";
import "./SpecialUnitsOverlay.css";

type SpecialUnitsOverlayProps = {
  unitType: string;
  faction?: string;
};

export function SpecialUnitsOverlay({
  faction,
  unitType
}: SpecialUnitsOverlayProps): React.ReactElement | null {
const specialByUnit = SPECIAL_UNIT_SPRITES[unitType as keyof typeof SPECIAL_UNIT_SPRITES];
const specialByFactionUnit = SPECIAL_FACTION_SPRITES[faction as keyof typeof SPECIAL_FACTION_SPRITES]?.find(special => special.sprite === unitType);
if (!specialByUnit && !specialByFactionUnit) return null;

if (specialByFactionUnit) {
  return (
  <div className="special-unit-overlay" aria-hidden="true">
    <span className={`special-unit-badge special-unit-badge--${unitType}`}>
      {specialByFactionUnit.label}
    </span>
  </div>
);
} else {
return (
  <div className="special-unit-overlay" aria-hidden="true">
    <span className={`special-unit-badge special-unit-badge--${unitType}`}>
      {specialByUnit.label}
    </span>
  </div>
);
}
}