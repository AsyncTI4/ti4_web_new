import { Fragment, type ReactNode } from "react";
import { Box, Text, Stack, Group, Image, Divider } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { cdnImage } from "@/entities/data/cdnImage";
import { TECH_PREREQ_ICON } from "@/entities/lookup/tech";
import type { Unit } from "@/entities/data/types";
import {
  DICE_ABILITIES,
  type AssimilatedAbility,
  type getUpgradeInfo,
  type InheritedAbilities,
} from "./unitAbilityLookups";
import styles from "./UnitDetailsCard.module.css";

type UpgradeInfo = NonNullable<ReturnType<typeof getUpgradeInfo>>;

function StatBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box ta="center" py={6} className={styles.statBox}>
      <Text size="10px" fw={500} c="gray.5" className={styles.statLabel} mb={2}>
        {label}
      </Text>
      <Text size="md" fw={700} c="white" className={styles.statValue}>
        {children}
      </Text>
    </Box>
  );
}

function ModifiedValue({
  base,
  modifier,
}: {
  base: number;
  modifier?: number;
}) {
  if (!modifier) return base;
  return (
    <>
      <Text component="span" c="gray.6" td="line-through" fz="xs" mr={3}>
        {base}
      </Text>
      <Text component="span" c="green.4">
        {base + modifier}
      </Text>
    </>
  );
}

function InheritedTag() {
  return (
    <Text size="xs" c="violet.4" className={styles.inheritedTag}>
      inherited
    </Text>
  );
}

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

export function UnitStats({
  unit,
  bonusCombatDice,
  combatValueModifier,
  costModifier,
}: {
  unit: Unit;
  bonusCombatDice?: number;
  combatValueModifier?: number;
  costModifier?: number;
}) {
  const showDice = !!(unit.combatDieCount || bonusCombatDice);
  return (
    <Group gap={8}>
      <StatBox label="Cost">
        {unit.cost != null ? (
          <ModifiedValue base={unit.cost} modifier={costModifier} />
        ) : (
          "—"
        )}
      </StatBox>
      <StatBox label="Combat">
        {unit.combatHitsOn != null ? (
          <>
            <ModifiedValue
              base={unit.combatHitsOn}
              modifier={combatValueModifier}
            />
            {showDice && (
              <Text
                component="span"
                c={bonusCombatDice ? "violet.4" : "gray.5"}
                fz="xs"
                ml={2}
              >
                ×{(unit.combatDieCount ?? 1) + (bonusCombatDice ?? 0)}
              </Text>
            )}
          </>
        ) : (
          "—"
        )}
      </StatBox>
      <StatBox label="Move">{unit.moveValue ?? "—"}</StatBox>
      <StatBox label="Capacity">{unit.capacityValue ?? "—"}</StatBox>
    </Group>
  );
}

export function ModifierAttribution({
  bonusCombatDice,
  combatValueModifier,
  costModifier,
}: {
  bonusCombatDice?: number;
  combatValueModifier?: number;
  costModifier?: number;
}) {
  const parts = [
    costModifier
      ? {
          key: "cost",
          color: "green.5",
          text: `${signed(costModifier)} cost (Valefar Prime)`,
        }
      : null,
    combatValueModifier
      ? {
          key: "combat",
          color: "green.5",
          text: `${signed(combatValueModifier)} combat (Eidolon Terminus)`,
        }
      : null,
    bonusCombatDice
      ? {
          key: "dice",
          color: "violet.4",
          text: `+${bonusCombatDice} die (Eidolon Landwaster)`,
        }
      : null,
  ].filter((part) => part !== null);
  if (parts.length === 0) return null;

  return (
    <Text size="xs" c="gray.5" className={styles.modifierAttribution}>
      {parts.map((part, index) => (
        <Fragment key={part.key}>
          {index > 0 && " · "}
          <Text component="span" c={part.color}>
            {part.text}
          </Text>
        </Fragment>
      ))}
    </Text>
  );
}

function CardSection({ children }: { children: ReactNode }) {
  return (
    <>
      <Divider color="gray.8" />
      {children}
    </>
  );
}

export function AbilitySection({ ability }: { ability?: string }) {
  if (!ability) return null;
  return (
    <CardSection>
      <Box>
        <Text c="gray.5" mb={5} className={styles.sectionTitle}>
          Ability
        </Text>
        <Text size="sm" c="gray.3" className={styles.abilityText}>
          {ability}
        </Text>
      </Box>
    </CardSection>
  );
}

function BorrowedAbilityList({
  heading,
  headingColor,
  items,
}: {
  heading: string;
  headingColor: string;
  items: { key: string; title: ReactNode; ability: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <CardSection>
      <Box>
        <Text size="xs" fw={500} c={headingColor} mb={6}>
          {heading}
        </Text>
        <Stack gap={6}>
          {items.map((item) => (
            <Box key={item.key} p={8} className={styles.inheritedAbilityBox}>
              {item.title}
              <Text
                size="sm"
                c="gray.4"
                className={styles.inheritedAbilityText}
              >
                {item.ability}
              </Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </CardSection>
  );
}

export function InheritedAbilityList({
  inherited,
}: {
  inherited: InheritedAbilities | null;
}) {
  return (
    <BorrowedAbilityList
      heading="Inherited Abilities"
      headingColor="violet.4"
      items={(inherited?.abilities ?? []).map(
        ({ unitName, ability }, index) => ({
          key: String(index),
          ability,
          title: (
            <Text
              size="xs"
              c="violet.3"
              fw={600}
              mb={3}
              className={styles.inheritedAbilityTitle}
            >
              {unitName}
            </Text>
          ),
        }),
      )}
    />
  );
}

export function AssimilatedAbilityList({
  assimilated,
}: {
  assimilated: AssimilatedAbility[];
}) {
  return (
    <BorrowedAbilityList
      heading="Assimilated Flagship Abilities (Valefar Z)"
      headingColor="teal.4"
      items={assimilated.map((entry, index) => ({
        key: String(index),
        ability: entry.ability,
        title: (
          <Group gap={6} mb={3}>
            <Image
              src={cdnImage(`/factions/${entry.faction.toLowerCase()}.png`)}
              alt={entry.faction}
              w={16}
              h={16}
            />
            <Text
              size="xs"
              c="teal.3"
              fw={600}
              className={styles.inheritedAbilityTitle}
            >
              {entry.flagshipName}
            </Text>
          </Group>
        ),
      }))}
    />
  );
}

export function UnitAbilitiesSection({
  unit,
  inherited,
}: {
  unit: Unit;
  inherited: InheritedAbilities | null;
}) {
  const dice = DICE_ABILITIES.filter(
    ({ hitsOn }) => unit[hitsOn] || inherited?.[hitsOn],
  );
  const sustainInherited = !!inherited?.sustainDamage && !unit.sustainDamage;
  const hasSustain = !!unit.sustainDamage || sustainInherited;
  const hasAny =
    dice.length > 0 ||
    !!unit.planetaryShield ||
    hasSustain ||
    !!unit.productionValue;
  if (!hasAny) return null;

  return (
    <CardSection>
      <Box>
        <Text c="gray.5" mb={5} className={styles.sectionTitle}>
          Unit Abilities
        </Text>
        <Stack gap={4}>
          {dice.map(({ label, hitsOn, dieCount }) => {
            const inheritedHitsOn = inherited?.[hitsOn];
            const count = inherited?.[dieCount] ?? unit[dieCount];
            return (
              <Group key={label} gap={6}>
                <Text size="sm" c="gray.4">
                  {label}
                </Text>
                <Text size="sm" fw={600} c="white">
                  {inheritedHitsOn ?? unit[hitsOn]}
                  {(count ?? 0) > 1 && ` ×${count}`}
                </Text>
                {inheritedHitsOn && !unit[hitsOn] && <InheritedTag />}
              </Group>
            );
          })}
          {unit.planetaryShield && (
            <Text size="sm" c="gray.4">
              Planetary Shield
            </Text>
          )}
          {hasSustain && (
            <Group gap={6}>
              <Text size="sm" c="gray.4">
                Sustain Damage
              </Text>
              {sustainInherited && <InheritedTag />}
            </Group>
          )}
          {!!unit.productionValue && (
            <Group gap={6}>
              <Text size="sm" c="gray.4">
                Production
              </Text>
              <Text size="sm" fw={600} c="white">
                {unit.productionValue}
              </Text>
            </Group>
          )}
        </Stack>
      </Box>
    </CardSection>
  );
}

function TechPrerequisites({ requirements }: { requirements?: string }) {
  if (!requirements) return null;
  return (
    <Group gap={2} ml="auto">
      {requirements.split("").map((char, i) => {
        const src = TECH_PREREQ_ICON[char];
        if (!src) return null;
        return (
          <Image
            key={`${char}-${i}`}
            src={src}
            alt={char}
            w={12}
            h={12}
            className={styles.techIcon}
          />
        );
      })}
    </Group>
  );
}

export function UpgradeSection({ upgrade }: { upgrade: UpgradeInfo | null }) {
  if (!upgrade) return null;
  const { upgradeUnit, upgradeTech } = upgrade;
  return (
    <CardSection>
      <Box p={8} className={styles.upgradeBox}>
        <Group gap={6} align="center" mb={upgradeUnit.ability ? 6 : 0}>
          <Text size="xs" fw={500} c="gray.6" className={styles.sectionTitle}>
            Upgrades to
          </Text>
          <IconArrowRight size={12} color="var(--mantine-color-gray-6)" />
          <Text size="sm" fw={600} c="gray.4">
            {upgradeUnit.name}
          </Text>
          <TechPrerequisites requirements={upgradeTech.requirements} />
        </Group>
        {upgradeUnit.ability && (
          <Text size="sm" c="gray.6" className={styles.upgradeAbilityText}>
            {upgradeUnit.ability}
          </Text>
        )}
      </Box>
    </CardSection>
  );
}
