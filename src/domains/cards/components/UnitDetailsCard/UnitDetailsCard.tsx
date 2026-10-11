import { Image } from "@/ds";
import { cdnImage } from "@/entities/data/cdnImage";
import { getColorAlias } from "@/entities/lookup/colors";
import { getUnitData, isNekroFlagship } from "@/entities/lookup/units";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { useGameData } from "@/state/useGameContext";
import type { PlayerData } from "@/entities/data/types";
import {
  getAssimilatedAbilitiesForNekroFlagship,
  getInheritedAbilitiesForPinktfFlagship,
  getUpgradeInfo,
} from "./unitAbilityLookups";
import {
  AbilitySection,
  AssimilatedAbilityList,
  InheritedAbilityList,
  ModifierAttribution,
  UnitAbilitiesSection,
  UnitStats,
  UpgradeSection,
} from "./UnitDetailsSections";
import styles from "./UnitDetailsCard.module.css";

type Props = {
  unitId: string;
  color?: string;
  bonusCombatDice?: number;
  combatValueModifier?: number;
  costModifier?: number;
  playerUnitsOwned?: string[];
  valefarZTargets?: string[];
  allPlayerData?: PlayerData[];
};

/** Whose unit this is: the colour alone means nothing without the legend. */
function UnitOwner({ owner }: { owner: PlayerData }) {
  return (
    <span className={styles.owner}>
      <FactionIcon faction={owner.faction} w={12} h={12} />
      {getPlayerFactionDisplayName(owner)}
    </span>
  );
}

export function UnitDetailsCard({
  unitId,
  color,
  bonusCombatDice,
  combatValueModifier,
  costModifier,
  playerUnitsOwned,
  valefarZTargets,
  allPlayerData,
}: Props) {
  const gameData = useGameData();
  const unitData = getUnitData(unitId);
  if (!unitData) return null;

  const owner = color
    ? gameData?.playerData?.find((player) => player.color === color)
    : undefined;

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const inherited =
    unitId === "pinktf_flagship"
      ? getInheritedAbilitiesForPinktfFlagship(playerUnitsOwned)
      : null;
  const assimilated = isNekroFlagship(unitId)
    ? getAssimilatedAbilitiesForNekroFlagship(valefarZTargets, allPlayerData)
    : [];
  const upgrade =
    !isUpgraded && unitData.upgradesToUnitId
      ? getUpgradeInfo(unitData.upgradesToUnitId)
      : null;
  const modifiers = { bonusCombatDice, combatValueModifier, costModifier };

  return (
    <DetailsCard width={380}>
      <DetailsCard.Title
        title={unitData.name}
        type={isUpgraded ? "Upgraded unit" : "Unit"}
        meta={[owner ? <UnitOwner key="owner" owner={owner} /> : null]}
        icon={
          <DetailsCard.Icon
            shape="unit"
            icon={
              <Image
                src={cdnImage(`/units/${getColorAlias(color)}_${unitData.asyncId}.png`)}
                alt=""
              />
            }
            badge={
              unitData.faction ? (
                <Image
                  src={cdnImage(`/factions/${unitData.faction.toLowerCase()}.png`)}
                  alt={`${unitData.faction} faction`}
                />
              ) : undefined
            }
          />
        }
      />
      <div className={styles.stats}>
        <UnitStats unit={unitData} {...modifiers} />
        <ModifierAttribution {...modifiers} />
      </div>
      <AbilitySection ability={unitData.ability} />
      <InheritedAbilityList inherited={inherited} />
      <AssimilatedAbilityList assimilated={assimilated} />
      <UnitAbilitiesSection unit={unitData} inherited={inherited} />
      <UpgradeSection upgrade={upgrade} />
    </DetailsCard>
  );
}
