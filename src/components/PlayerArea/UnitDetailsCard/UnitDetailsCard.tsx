import { Box, Text, Stack, Group, Image, Divider } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { getColorAlias } from "@/lookup/colors";
import { getUnitData } from "@/lookup/units";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { getTechData } from "@/lookup/tech";
import { IconArrowRight } from "@tabler/icons-react";
import styles from "./UnitDetailsCard.module.css";
import { Unit } from "@/data/types";

type Props = {
  unitId: string;
  color?: string;
  bonusCombatDice?: number;
  combatValueModifier?: number;
  costModifier?: number;
  playerUnitsOwned?: string[];
};

type InheritedAbilities = {
  abilities: string[];
  afbHitsOn?: number;
  afbDieCount?: number;
  bombardHitsOn?: number;
  bombardDieCount?: number;
  spaceCannonHitsOn?: number;
  spaceCannonDieCount?: number;
  sustainDamage?: boolean;
};

function isUnitUpgradeTechnology(unitId: string, unit: { upgradesFromUnitId?: string; baseType: string }): boolean {
  // Traditional upgrades (like destroyer2)
  if (unit.upgradesFromUnitId) return true;

  // Twilight's Fall unit upgrade technologies (tf- prefix)
  // These are faction-specific unit upgrades that don't use upgradesFromUnitId
  if (unitId.startsWith("tf-")) return true;

  return false;
}

function getInheritedAbilitiesForPinktfFlagship(
  playerUnitsOwned?: string[]
): InheritedAbilities | null {
  if (!playerUnitsOwned) return null;

  const targetBaseTypes = ["destroyer", "cruiser", "dreadnought"];
  const inheritedAbilities: string[] = [];
  let afbHitsOn: number | undefined;
  let afbDieCount: number | undefined;
  let bombardHitsOn: number | undefined;
  let bombardDieCount: number | undefined;
  let spaceCannonHitsOn: number | undefined;
  let spaceCannonDieCount: number | undefined;
  let sustainDamage: boolean | undefined;

  for (const ownedUnitId of playerUnitsOwned) {
    const ownedUnit = getUnitData(ownedUnitId);
    if (!ownedUnit) continue;

    // Only consider unit upgrade technologies
    if (!isUnitUpgradeTechnology(ownedUnitId, ownedUnit)) continue;

    // Only consider destroyer, cruiser, dreadnought
    if (!targetBaseTypes.includes(ownedUnit.baseType)) continue;

    // Collect text abilities
    if (ownedUnit.ability) {
      inheritedAbilities.push(`${ownedUnit.name}: ${ownedUnit.ability}`);
    }

    // Collect unit abilities (AFB, Bombardment, Space Cannon, Sustain)
    if (ownedUnit.afbHitsOn) {
      afbHitsOn = ownedUnit.afbHitsOn;
      afbDieCount = ownedUnit.afbDieCount;
    }
    if (ownedUnit.bombardHitsOn) {
      bombardHitsOn = ownedUnit.bombardHitsOn;
      bombardDieCount = ownedUnit.bombardDieCount;
    }
    if (ownedUnit.spaceCannonHitsOn) {
      spaceCannonHitsOn = ownedUnit.spaceCannonHitsOn;
      spaceCannonDieCount = ownedUnit.spaceCannonDieCount;
    }
    if (ownedUnit.sustainDamage) {
      sustainDamage = true;
    }
  }

  if (
    inheritedAbilities.length === 0 &&
    !afbHitsOn &&
    !bombardHitsOn &&
    !spaceCannonHitsOn &&
    !sustainDamage
  ) {
    return null;
  }

  return {
    abilities: inheritedAbilities,
    afbHitsOn,
    afbDieCount,
    bombardHitsOn,
    bombardDieCount,
    spaceCannonHitsOn,
    spaceCannonDieCount,
    sustainDamage,
  };
}

export function UnitDetailsCard({
  unitId,
  color,
  bonusCombatDice,
  combatValueModifier,
  costModifier,
  playerUnitsOwned,
}: Props) {
  const unitData = getUnitData(unitId);
  if (!unitData) {
    console.warn(`Unit with ID "${unitId}" not found`);
    return null;
  }

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;
  const colorAlias = getColorAlias(color);

  // Special handling for pinktf_flagship
  const inheritedAbilities =
    unitId === "pinktf_flagship"
      ? getInheritedAbilitiesForPinktfFlagship(playerUnitsOwned)
      : null;

  const upgradeInfo = !isUpgraded && unitData.upgradesToUnitId ? (() => {
    const upgradeUnit = getUnitData(unitData.upgradesToUnitId);
    if (!upgradeUnit || !upgradeUnit.requiredTechId) return null;

    const upgradeTech = getTechData(upgradeUnit.requiredTechId);
    if (!upgradeTech) return null;

    const combatKeys: Array<keyof Pick<Unit, "cost" | "combatHitsOn" | "combatDieCount" | "moveValue" | "capacityValue">> = ["cost", "combatHitsOn", "combatDieCount", "moveValue", "capacityValue"];
    const toStat = (value?: number) => (typeof value === "number" ? value : 0);

    const upgradeCombat: Partial<Record<typeof combatKeys[number], number>> = combatKeys.reduce(
      (acc, key) => {
        const valueBase = toStat(unitData[key]);
        const valueU = toStat(upgradeUnit[key]);
        if (valueBase !== valueU) acc[key] = valueU - valueBase;
        return acc;
      },
      {} as Partial<Record<typeof combatKeys[number], number>>
    );

    return { upgradeUnit, upgradeTech, upgradeCombat };
  })() : null;

  const unitIcon = (
    <Box pos="relative" w={60} h={60} className={styles.unitIconContainer}>
      <Image
        src={cdnImage(`/units/${colorAlias}_${unitData.asyncId}.png`)}
        w={50}
        h={50}
        className={styles.unitImage}
      />
      {isFaction && (
        <Box pos="absolute" bottom={-4} right={-4} className={styles.factionBadge}>
          <Image
            src={cdnImage(`/factions/${unitData.faction?.toLowerCase()}.png`)}
            alt={`${unitData.faction} faction`}
            w={20}
            h={20}
          />
        </Box>
      )}
    </Box>
  );

  const hasUnitAbilities = unitData.afbHitsOn || unitData.bombardHitsOn ||
    unitData.spaceCannonHitsOn || unitData.planetaryShield ||
    unitData.sustainDamage || unitData.productionValue ||
    inheritedAbilities?.afbHitsOn || inheritedAbilities?.bombardHitsOn ||
    inheritedAbilities?.spaceCannonHitsOn || inheritedAbilities?.sustainDamage;

  const upgradeCombat = upgradeInfo && Object.keys(upgradeInfo.upgradeCombat).length > 0
    ? upgradeInfo.upgradeCombat
    : null;

  return (
    <DetailsCard width={380}>
      <Stack gap={12}>
        {/* Header */}
        <DetailsCard.Title
          title={unitData.name}
          icon={<DetailsCard.Icon icon={unitIcon} />}
          caption={isUpgraded ? "Upgraded" : "Standard"}
          captionColor="blue"
        />

        {/* Stats - Primary visual element */}
        <Group gap={8}>
          <Box ta="center" py={6} className={styles.statBox}>
            <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Cost</Text>
            <Text size="md" fw={700} c="white" className={styles.statValue}>
              {unitData.cost != null ? (
                costModifier ? (
                  <>
                    <Text component="span" c="gray.6" td="line-through" fz="xs" mr={3}>{unitData.cost}</Text>
                    <Text component="span" c="green.4">{unitData.cost + costModifier}</Text>
                  </>
                ) : unitData.cost
              ) : "—"}
            </Text>
          </Box>
          <Box ta="center" py={6} className={styles.statBox}>
            <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Combat</Text>
            <Text size="md" fw={700} c="white" className={styles.statValue}>
              {unitData.combatHitsOn != null ? (
                <>
                  {combatValueModifier ? (
                    <>
                      <Text component="span" c="gray.6" td="line-through" fz="xs" mr={3}>{unitData.combatHitsOn}</Text>
                      <Text component="span" c="green.4">{unitData.combatHitsOn + combatValueModifier}</Text>
                    </>
                  ) : unitData.combatHitsOn}
                  {(unitData.combatDieCount || bonusCombatDice) && (
                    <Text component="span" c={bonusCombatDice ? "violet.4" : "gray.5"} fz="xs" ml={2}>
                      ×{(unitData.combatDieCount ?? 1) + (bonusCombatDice ?? 0)}
                    </Text>
                  )}
                </>
              ) : "—"}
            </Text>
          </Box>
          <Box ta="center" py={6} className={styles.statBox}>
            <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Move</Text>
            <Text size="md" fw={700} c="white" className={styles.statValue}>{unitData.moveValue ?? "—"}</Text>
          </Box>
          <Box ta="center" py={6} className={styles.statBox}>
            <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Capacity</Text>
            <Text size="md" fw={700} c="white" className={styles.statValue}>{unitData.capacityValue ?? "—"}</Text>
          </Box>
        </Group>

        {/* Modifier attribution - compact */}
        {(bonusCombatDice || combatValueModifier || costModifier) && (
          <Text size="xs" c="gray.5" className={styles.modifierAttribution}>
            {[
              costModifier && <Text key="cost" component="span" c="green.5">{costModifier > 0 ? "+" : ""}{costModifier} cost (Valefar Prime)</Text>,
              combatValueModifier && <Text key="combat" component="span" c="green.5">{combatValueModifier > 0 ? "+" : ""}{combatValueModifier} combat (Eidolon Terminus)</Text>,
              bonusCombatDice && <Text key="dice" component="span" c="violet.4">+{bonusCombatDice} die (Eidolon Landwaster)</Text>,
            ].filter(Boolean).reduce((acc, curr, i) => i === 0 ? [curr] : [...acc, " · ", curr], [] as React.ReactNode[])}
          </Text>
        )}

        {/* Ability text */}
        {unitData.ability && (
          <>
            <Divider color="gray.8" />
            <Box>
              <Text size="xs" fw={500} c="gray.5" mb={4}>Ability</Text>
              <Text size="sm" c="gray.3" className={styles.abilityText}>{unitData.ability}</Text>
            </Box>
          </>
        )}

        {/* Inherited abilities for pinktf_flagship */}
        {inheritedAbilities && inheritedAbilities.abilities.length > 0 && (
          <>
            <Divider color="gray.8" />
            <Box>
              <Text size="xs" fw={500} c="violet.4" mb={6}>Inherited Abilities</Text>
              <Stack gap={6}>
                {inheritedAbilities.abilities.map((ability, index) => {
                  const [unitName, ...abilityParts] = ability.split(": ");
                  const abilityText = abilityParts.join(": ");
                  return (
                    <Box key={index} p={8} className={styles.inheritedAbilityBox}>
                      <Text size="xs" c="violet.3" fw={600} mb={3} className={styles.inheritedAbilityTitle}>{unitName}</Text>
                      <Text size="sm" c="gray.4" className={styles.inheritedAbilityText}>{abilityText}</Text>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </>
        )}

        {/* Unit abilities (AFB, Bombardment, etc.) */}
        {hasUnitAbilities && (
          <>
            <Divider color="gray.8" />
            <Box>
              <Text size="xs" fw={500} c="gray.5" mb={4}>Unit Abilities</Text>
              <Stack gap={4}>
                {(unitData.afbHitsOn || inheritedAbilities?.afbHitsOn) && (
                  <Group gap={6}>
                    <Text size="sm" c="gray.4">Anti-Fighter Barrage</Text>
                    <Text size="sm" fw={600} c="white">
                      {inheritedAbilities?.afbHitsOn ?? unitData.afbHitsOn}
                      {((inheritedAbilities?.afbDieCount ?? unitData.afbDieCount) ?? 0) > 1 && ` ×${inheritedAbilities?.afbDieCount ?? unitData.afbDieCount}`}
                    </Text>
                    {inheritedAbilities?.afbHitsOn && !unitData.afbHitsOn && <Text size="xs" c="violet.4" className={styles.inheritedTag}>inherited</Text>}
                  </Group>
                )}
                {(unitData.bombardHitsOn || inheritedAbilities?.bombardHitsOn) && (
                  <Group gap={6}>
                    <Text size="sm" c="gray.4">Bombardment</Text>
                    <Text size="sm" fw={600} c="white">
                      {inheritedAbilities?.bombardHitsOn ?? unitData.bombardHitsOn}
                      {((inheritedAbilities?.bombardDieCount ?? unitData.bombardDieCount) ?? 0) > 1 && ` ×${inheritedAbilities?.bombardDieCount ?? unitData.bombardDieCount}`}
                    </Text>
                    {inheritedAbilities?.bombardHitsOn && !unitData.bombardHitsOn && <Text size="xs" c="violet.4" className={styles.inheritedTag}>inherited</Text>}
                  </Group>
                )}
                {(unitData.spaceCannonHitsOn || inheritedAbilities?.spaceCannonHitsOn) && (
                  <Group gap={6}>
                    <Text size="sm" c="gray.4">Space Cannon</Text>
                    <Text size="sm" fw={600} c="white">
                      {inheritedAbilities?.spaceCannonHitsOn ?? unitData.spaceCannonHitsOn}
                      {((inheritedAbilities?.spaceCannonDieCount ?? unitData.spaceCannonDieCount) ?? 0) > 1 && ` ×${inheritedAbilities?.spaceCannonDieCount ?? unitData.spaceCannonDieCount}`}
                    </Text>
                    {inheritedAbilities?.spaceCannonHitsOn && !unitData.spaceCannonHitsOn && <Text size="xs" c="violet.4" className={styles.inheritedTag}>inherited</Text>}
                  </Group>
                )}
                {unitData.planetaryShield && <Text size="sm" c="gray.4">Planetary Shield</Text>}
                {(unitData.sustainDamage || inheritedAbilities?.sustainDamage) && (
                  <Group gap={6}>
                    <Text size="sm" c="gray.4">Sustain Damage</Text>
                    {inheritedAbilities?.sustainDamage && !unitData.sustainDamage && <Text size="xs" c="violet.4" className={styles.inheritedTag}>inherited</Text>}
                  </Group>
                )}
                {unitData.productionValue && (
                  <Group gap={6}>
                    <Text size="sm" c="gray.4">Production</Text>
                    <Text size="sm" fw={600} c="white">{unitData.productionValue}</Text>
                  </Group>
                )}
              </Stack>
            </Box>
          </>
        )}

        {/* Upgrade path */}
        {upgradeInfo && (
          <>
            <Divider color="gray.8" />
            <Box p={8} className={styles.upgradeBox}>
              <Group gap={6} align="center" mb={upgradeInfo.upgradeUnit.ability ? 6 : 0}>
                <Text size="xs" fw={500} c="gray.6" className={styles.sectionTitle}>Upgrades to</Text>
                <IconArrowRight size={12} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={600} c="gray.4">{upgradeInfo.upgradeUnit.name}</Text>
                {upgradeInfo.upgradeTech.requirements && (
                  <Group gap={2} ml="auto">
                    {upgradeInfo.upgradeTech.requirements.split("").map((char, i) => {
                      const iconMap: Record<string, string> = { B: "/blue.png", G: "/green.png", R: "/red.png", Y: "/yellow.png" };
                      const src = iconMap[char];
                      if (!src) return null;
                      return <Image key={`${char}-${i}`} src={src} alt={char} w={12} h={12} className={styles.techIcon} />;
                    })}
                  </Group>
                )}
              </Group>
              {upgradeInfo.upgradeUnit.ability && (
                <Text size="sm" c="gray.6" className={styles.upgradeAbilityText}>{upgradeInfo.upgradeUnit.ability}</Text>
              )}

              {/* Upgraded combat modifiers */}
              {upgradeCombat && (
              <Group gap={8}>
                <Box ta="center" py={6} className={styles.statBox}>
                  <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Cost</Text>
                  <Text size="sm" fw={700} c="white" className={styles.statValue}>
                    {upgradeCombat.cost != null ? (
                      <strong>
                        {upgradeCombat.cost > 0 ? `+${upgradeCombat.cost}` : `${upgradeCombat.cost}`}
                      </strong>
                    ) : "—"}
                  </Text>
                </Box>
                <Box ta="center" py={6} className={styles.statBox}>
                  <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Combat</Text>
                  <Text size="sm" fw={700} c="white" className={styles.statValue}>
                    {upgradeCombat.combatHitsOn != null || upgradeCombat.combatDieCount != null ? (
                      <>
                        {/* Don't show "+" for hit value when gaining the ability to do combat. */}
                        {upgradeCombat.combatHitsOn != null ? (
                          <strong>
                            {upgradeCombat.combatHitsOn > 0
                              ? `${typeof unitData.combatHitsOn === "number" ? "+": ""}${upgradeCombat.combatHitsOn}`
                              : `${upgradeCombat.combatHitsOn}`}
                          </strong>
                          )
                          : "—"
                        }
                        {/* Don't show "—" for no change in die count. */}
                        {upgradeCombat.combatDieCount != null && (
                          <Text component="span" c="gray.5" fz="xs" ml={2}>
                            ×{upgradeCombat.combatDieCount > 0 ? `+${upgradeCombat.combatDieCount}` : `${upgradeCombat.combatDieCount}`}
                          </Text>
                        )}
                      </>
                     ) : "—"
                  }
                  </Text>
                </Box>
                <Box ta="center" py={6} className={styles.statBox}>
                  <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Move</Text>
                  <Text size="sm" fw={700} c="white" className={styles.statValue}>
                    {upgradeCombat.moveValue != null ? (
                      <strong>
                        {upgradeCombat.moveValue > 0 ? `+${upgradeCombat.moveValue}` : `${upgradeCombat.moveValue}`}
                      </strong>
                    ) : "—"}
                  </Text>
                </Box>
                <Box ta="center" py={6} className={styles.statBox}>
                  <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>Capacity</Text>
                  <Text size="sm" fw={700} c="white" className={styles.statValue}>
                    {upgradeCombat.capacityValue != null ? (
                      <strong>
                        {upgradeCombat.capacityValue > 0 ? `+${upgradeCombat.capacityValue}` : `${upgradeCombat.capacityValue}`}
                      </strong>
                    ) : "—"}
                  </Text>
                </Box>
              </Group>
            )}

            </Box>
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
