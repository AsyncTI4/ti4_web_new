import { Image } from "@/ds";
import { cdnImage } from "@/entities/data/cdnImage";
import { getColorAlias } from "@/entities/lookup/colors";
import { getUnitData, isNekroFlagship } from "@/entities/lookup/units";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { useGameData } from "@/state/useGameContext";
import type { PlayerData } from "@/entities/data/types";
import { anomaliesInOrNextTo } from "@/entities/game/anomalies";
import { getUnitModifiers } from "@/entities/game/unitModifiers";
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
  /**
   * The map position the unit stands in, when it is a unit on the board: its
   * surroundings can change its numbers (Starlancer XI and anomalies).
   */
  tilePosition?: string;
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
  tilePosition,
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
  const tiles = gameData?.tiles;
  const tile = tilePosition ? tiles?.[tilePosition] : undefined;
  const { notes, ...modifiers } = getUnitModifiers(
    unitData,
    owner,
    tile ? anomaliesInOrNextTo(tile, tiles) : undefined,
  );

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
        <ModifierAttribution notes={notes} />
      </div>
      <AbilitySection ability={unitData.ability} />
      <InheritedAbilityList inherited={inherited} />
      <AssimilatedAbilityList assimilated={assimilated} />
      <UnitAbilitiesSection unit={unitData} inherited={inherited} />
      <UpgradeSection upgrade={upgrade} />
    </DetailsCard>
  );
}
