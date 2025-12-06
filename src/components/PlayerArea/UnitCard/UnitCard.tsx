import { useState } from "react";
import styles from "./UnitCard.module.css";
import { UnitDetailsCard } from "../UnitDetailsCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { Unit } from "@/components/shared/Unit";
import { BaseCard } from "./BaseCard";
import { getColorAlias } from "@/lookup/colors";
import { getUnitData } from "@/lookup/units";

type Props = {
  unitId: string;
  color?: string;
  deployedCount: number;
  unitCap?: number;
  compact?: boolean;
  locked?: boolean;
  lockedLabel?: string;
};
const DEFAULT_UNIT_CAPS = {
  carrier: 4,
  mech: 4,
  flagship: 1,
  spacedock: 3,
  dreadnought: 5,
  destroyer: 8,
  cruiser: 8,
  pds: 6,
  warsun: 2,
  infantry: 12,
  fighter: 10,
};
export function UnitCard({
  unitId,
  color,
  deployedCount,
  unitCap: unitCapProp,
  compact,
  locked,
  lockedLabel,
}: Props) {
  const [opened, setOpened] = useState(false);
  const unitData = getUnitData(unitId);
  const colorAlias = getColorAlias(color);
  if (!unitData) return null; // or some fallback UI
  const isUpgraded =
    unitData.upgradesFromUnitId !== undefined || unitData.baseType === "warsun";
  const isFaction = unitData.faction !== undefined;
  const defaultCap =
    DEFAULT_UNIT_CAPS[unitData.baseType as keyof typeof DEFAULT_UNIT_CAPS];
  const unitCap = unitCapProp ?? defaultCap;
  const reinforcements = unitCap - deployedCount;
  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div style={{ minWidth: "50px" }}>
          <BaseCard
            onClick={locked ? undefined : () => setOpened((o) => !o)}
            isUpgraded={isUpgraded}
            isFaction={isFaction}
            faction={unitData.faction}
            compact={compact}
            reinforcements={reinforcements}
            totalCapacity={unitCap}
            locked={locked}
            lockedLabel={lockedLabel}
          >
            <Unit
              unitType={unitData.asyncId}
              colorAlias={colorAlias}
              faction={unitData.faction}
              className={compact ? styles.unitImageCompact : styles.unitImage}
            />
          </BaseCard>
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        {!locked && <UnitDetailsCard unitId={unitId} color={color} />}
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
