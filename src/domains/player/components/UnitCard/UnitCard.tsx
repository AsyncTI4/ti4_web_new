import { useDisclosure } from "@/hooks/useDisclosure";
import styles from "./UnitCard.module.css";
import { UnitDetailsCard } from "../UnitDetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { Unit } from "@/shared/ui/Unit";
import { BaseCard } from "./BaseCard";
import { DenseUnitCell } from "./DenseUnitCell";
import { getColorAlias } from "@/entities/lookup/colors";
import {
  getOwnedTwilightsFallUnitByAsyncId,
  getUnitData,
  isNekroFlagship,
} from "@/entities/lookup/units";
import { useGameContext } from "@/hooks/useGameContext";

type Props = {
  unitId: string;
  color?: string;
  deployedCount: number;
  unitCap?: number;
  condensed?: boolean;
  showUpgradeState?: boolean;
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
  condensed,
  showUpgradeState = true,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const unitData = getUnitData(unitId);
  const colorAlias = getColorAlias(color);
  const gameData = useGameContext();

  if (!unitData) return null;

  const isMech = unitData.baseType === "mech";
  const playerData = color
    ? gameData?.playerData?.find((p) => p.color === color)
    : undefined;
  const playerUnitsOwned = playerData?.unitsOwned;

  const hasCabalMechUpgrade =
    isMech && playerUnitsOwned?.includes("tf-eidolonterminus");
  const hasNaazMechUpgrade =
    isMech && playerUnitsOwned?.includes("tf-eidolonlandwaster");
  const hasNekroMechUpgrade =
    isMech && playerUnitsOwned?.includes("tf-valefarprime");
  const ownedTwilightsFallUnit = getOwnedTwilightsFallUnitByAsyncId(
    unitData.asyncId,
    playerUnitsOwned
  );

  const allUpgradeFactions = Array.from(new Set([
    ...(hasCabalMechUpgrade ? ["cabal"] : []),
    ...(hasNaazMechUpgrade ? ["naaz"] : []),
    ...(hasNekroMechUpgrade ? ["nekro"] : []),
    ...(ownedTwilightsFallUnit?.faction ? [ownedTwilightsFallUnit.faction] : []),
  ]));
  const unitIsUpgraded =
    unitData.upgradesFromUnitId !== undefined || unitData.baseType === "warsun";
  const isUpgraded =
    showUpgradeState && (unitIsUpgraded || allUpgradeFactions.length > 0);
  const upgradeFactions =
    showUpgradeState && allUpgradeFactions.length > 0
      ? allUpgradeFactions
      : undefined;
  const isFaction = unitData.faction !== undefined;
  const defaultCap =
    DEFAULT_UNIT_CAPS[unitData.baseType as keyof typeof DEFAULT_UNIT_CAPS];
  const unitCap = unitCapProp ?? defaultCap;
  const reinforcements = unitCap - deployedCount;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        {condensed ? (
          <DenseUnitCell
            image={
              <Unit
                unitType={unitData.asyncId}
                colorAlias={colorAlias}
                faction={unitData.faction}
                className={styles.denseUnitImage}
                scaleSprite
                showFactionTokens={false}
              />
            }
            reinforcements={reinforcements}
            totalCapacity={unitCap}
            upgraded={isUpgraded}
            faction={isFaction ? unitData.faction : undefined}
            upgradeFactions={upgradeFactions}
            onClick={toggle}
          />
        ) : (
          <div style={{ minWidth: "44px" }}>
            <BaseCard
              onClick={toggle}
              isUpgraded={isUpgraded}
              isFaction={isFaction}
              faction={unitData.faction}
              reinforcements={reinforcements}
              totalCapacity={unitCap}
              upgradeFactions={upgradeFactions}
            >
              <Unit
                unitType={unitData.asyncId}
                colorAlias={colorAlias}
                faction={unitData.faction}
                className={styles.unitImage}
                scaleSprite
                showFactionTokens={false}
              />
            </BaseCard>
          </div>
        )}
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        <UnitDetailsCard
          unitId={unitId}
          color={color}
          bonusCombatDice={hasNaazMechUpgrade ? 1 : undefined}
          combatValueModifier={hasCabalMechUpgrade ? -1 : undefined}
          costModifier={hasNekroMechUpgrade ? -1 : undefined}
          playerUnitsOwned={
            unitId === "pinktf_flagship" ? playerUnitsOwned : undefined
          }
          valefarZTargets={
            isNekroFlagship(unitId) ? playerData?.valefarZTargets : undefined
          }
          allPlayerData={
            isNekroFlagship(unitId) ? gameData?.playerData : undefined
          }
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
