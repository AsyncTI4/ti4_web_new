import { Box, Stack, Image } from "@mantine/core";
import { cdnImage } from "@/entities/data/cdnImage";
import { getColorAlias } from "@/entities/lookup/colors";
import { getUnitData, isNekroFlagship } from "@/entities/lookup/units";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import type { PlayerData, Unit } from "@/entities/data/types";
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

function UnitIcon({ unit, color }: { unit: Unit; color?: string }) {
  return (
    <Box pos="relative" w={60} h={60} className={styles.unitIconContainer}>
      <Image
        src={cdnImage(`/units/${getColorAlias(color)}_${unit.asyncId}.png`)}
        w={50}
        h={50}
        className={styles.unitImage}
      />
      {unit.faction !== undefined && (
        <Box
          pos="absolute"
          bottom={-4}
          right={-4}
          className={styles.factionBadge}
        >
          <Image
            src={cdnImage(`/factions/${unit.faction.toLowerCase()}.png`)}
            alt={`${unit.faction} faction`}
            w={20}
            h={20}
          />
        </Box>
      )}
    </Box>
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
  const unitData = getUnitData(unitId);
  if (!unitData) return null;

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
      <Stack gap={12}>
        <DetailsCard.Title
          title={unitData.name}
          subtitle=""
          icon={
            <DetailsCard.Icon
              icon={<UnitIcon unit={unitData} color={color} />}
            />
          }
          caption={isUpgraded ? "Upgraded" : "Standard"}
          captionColor="blue"
        />
        <UnitStats unit={unitData} {...modifiers} />
        <ModifierAttribution {...modifiers} />
        <AbilitySection ability={unitData.ability} />
        <InheritedAbilityList inherited={inherited} />
        <AssimilatedAbilityList assimilated={assimilated} />
        <UnitAbilitiesSection unit={unitData} inherited={inherited} />
        <UpgradeSection upgrade={upgrade} />
      </Stack>
    </DetailsCard>
  );
}
