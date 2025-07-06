import { useState } from "react";
import { units } from "../../../data/units";
import { colors } from "../../../data/colors";
import styles from "./UnitCard.module.css";
import { UnitDetailsCard } from "../UnitDetailsCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { Unit } from "@/components/shared/Unit";
import { BaseCard } from "./BaseCard";

type Props = {
  unitId: string;
  color?: string;
  deployedCount: number;
  compact?: boolean;
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

export function UnitCard({ unitId, color, deployedCount, compact }: Props) {
  const [opened, setOpened] = useState(false);
  const unitData = getUnitData(unitId);
  const colorAlias = getColorAlias(color);

  if (!unitData) return null; // or some fallback UI

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;

  const unitCap =
    DEFAULT_UNIT_CAPS[unitData.baseType as keyof typeof DEFAULT_UNIT_CAPS];

  const reinforcements = unitCap - deployedCount;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div>
          <BaseCard
            onClick={() => setOpened((o) => !o)}
            isUpgraded={isUpgraded}
            isFaction={isFaction}
            faction={unitData.faction}
            compact={compact}
            reinforcements={reinforcements}
            totalCapacity={unitCap}
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
        <UnitDetailsCard unitId={unitId} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

// Helper function to get unit data by ID
const getUnitData = (unitId: string) => {
  return units.find((unit) => unit.id === unitId);
};

// Helper function to get color alias from color name
const getColorAlias = (color?: string) => {
  if (!color) return "pnk"; // default fallback

  const colorData = colors.find(
    (solidColor) =>
      solidColor.name === color.toLowerCase() ||
      solidColor.aliases.includes(color.toLowerCase()) ||
      solidColor.alias === color.toLowerCase()
  );

  return colorData?.alias || "pnk"; // fallback to pink if not found
};
