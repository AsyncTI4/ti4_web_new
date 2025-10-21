import { Box, Text, Stack, Group, Image, Divider } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { getColorAlias } from "@/lookup/colors";
import { getUnitData } from "@/lookup/units";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { getTechData } from "@/lookup/tech";
import { IconArrowRight } from "@tabler/icons-react";

type Props = {
  unitId: string;
  color?: string;
};

export function UnitDetailsCard({ unitId, color }: Props) {
  const unitData = getUnitData(unitId);
  if (!unitData) {
    console.warn(`Unit with ID "${unitId}" not found`);
    return null;
  }

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;
  const colorAlias = getColorAlias(color);

  const upgradeInfo = !isUpgraded && unitData.upgradesToUnitId ? (() => {
    const upgradeUnit = getUnitData(unitData.upgradesToUnitId);
    if (!upgradeUnit || !upgradeUnit.requiredTechId) return null;

    const upgradeTech = getTechData(upgradeUnit.requiredTechId);
    if (!upgradeTech) return null;

    return { upgradeUnit, upgradeTech };
  })() : null;

  const unitIcon = (
    <Box
      pos="relative"
      w={60}
      h={60}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={cdnImage(`/units/${colorAlias}_${unitData.asyncId}.png`)}
        w={50}
        h={50}
        style={{ objectFit: "contain" }}
      />
      {isFaction && (
        <Box
          pos="absolute"
          bottom={-4}
          right={-4}
          style={{ background: "rgba(0,0,0,0.5)", borderRadius: 4, padding: 2 }}
        >
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

  return (
    <DetailsCard width={380}>
      <Stack gap="md">
        <DetailsCard.Title
          title={unitData.name}
          subtitle={isFaction ? `${unitData.faction} Unit` : "Unit"}
          icon={<DetailsCard.Icon icon={unitIcon} />}
          caption={isUpgraded ? "Upgraded" : "Standard"}
          captionColor="blue"
        />

        {/* Ability text */}
        {unitData.ability && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section title="Ability" content={unitData.ability} />
          </>
        )}

        {/* Abilities breakdown */}
        {(unitData.afbHitsOn ||
          unitData.bombardHitsOn ||
          unitData.spaceCannonHitsOn ||
          unitData.planetaryShield ||
          unitData.sustainDamage ||
          unitData.productionValue) && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section
              title="Abilities"
              content={
                <Stack gap={2}>
                  {unitData.afbHitsOn && (
                    <Group gap="xs" justify="flex-start">
                      <Text size="xs" fw={600} c="gray.3" tt="uppercase">
                        Anti-Fighter Barrage
                      </Text>
                      <Text size="sm" fw={700} c="white">
                        {unitData.afbHitsOn}
                        {unitData.afbDieCount &&
                          unitData.afbDieCount > 1 &&
                          ` (x${unitData.afbDieCount})`}
                      </Text>
                    </Group>
                  )}
                  {unitData.bombardHitsOn && (
                    <Group gap="xs" justify="flex-start">
                      <Text size="xs" fw={600} c="gray.3" tt="uppercase">
                        Bombardment
                      </Text>
                      <Text size="xs" fw={700} c="white">
                        {unitData.bombardHitsOn}
                        {unitData.bombardDieCount &&
                          unitData.bombardDieCount > 1 &&
                          ` (x${unitData.bombardDieCount})`}
                      </Text>
                    </Group>
                  )}
                  {unitData.spaceCannonHitsOn && (
                    <Group gap="xs" justify="flex-start">
                      <Text size="xs" fw={600} c="gray.3" tt="uppercase">
                        Space Cannon
                      </Text>
                      <Text size="sm" fw={700} c="white">
                        {unitData.spaceCannonHitsOn}
                        {unitData.spaceCannonDieCount &&
                          unitData.spaceCannonDieCount > 1 &&
                          ` (x${unitData.spaceCannonDieCount})`}
                      </Text>
                    </Group>
                  )}
                  {unitData.planetaryShield && (
                    <Text size="xs" fw={600} c="gray.3" tt="uppercase">
                      Planetary Shield
                    </Text>
                  )}
                  {unitData.sustainDamage && (
                    <Text size="xs" fw={600} c="gray.3" tt="uppercase">
                      Sustain Damage
                    </Text>
                  )}
                  {unitData.productionValue && (
                    <Group gap="xs" justify="flex-start">
                      <Text size="xs" fw={600} c="gray.3" tt="uppercase">
                        Production
                      </Text>
                      <Text size="sm" fw={700} c="white">
                        {unitData.productionValue}
                      </Text>
                    </Group>
                  )}
                </Stack>
              }
            />
          </>
        )}

        <Divider c="gray.7" opacity={0.8} />

        {/* Stats */}
        <DetailsCard.Section
          content={
            <Box>
              <Group gap="xs" justify="space-between">
                <Box ta="center" style={{ flex: 1 }}>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase" mb={2}>
                    Cost
                  </Text>
                  <Text size="lg" fw={700} c="white">
                    {unitData.cost ?? "—"}
                  </Text>
                </Box>
                <Box ta="center" style={{ flex: 1 }}>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase" mb={2}>
                    Combat
                  </Text>
                  <Text size="lg" fw={700} c="white">
                    {unitData.combatHitsOn ?? "—"}
                    {unitData.combatDieCount &&
                      unitData.combatDieCount > 1 &&
                      ` (x${unitData.combatDieCount})`}
                  </Text>
                </Box>
                <Box ta="center" style={{ flex: 1 }}>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase" mb={2}>
                    Move
                  </Text>
                  <Text size="lg" fw={700} c="white">
                    {unitData.moveValue ?? "—"}
                  </Text>
                </Box>
                <Box ta="center" style={{ flex: 1 }}>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase" mb={2}>
                    Capacity
                  </Text>
                  <Text size="lg" fw={700} c="white">
                    {unitData.capacityValue ?? "—"}
                  </Text>
                </Box>
              </Group>
            </Box>
          }
        />

        {/* Upgrade info for non-upgraded units */}
        {upgradeInfo && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box
              p="sm"
              style={{
                background: "var(--upgrade-card-bg, linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%))",
                border: "var(--upgrade-card-border, 1px solid rgba(59, 130, 246, 0.2))",
                borderRadius: 8,
              }}
            >
              <Stack gap="xs">
                <Group gap="xs" align="center" justify="space-between" wrap="nowrap">
                  <Group gap="xs" align="center" wrap="nowrap">
                    <Text size="xs" fw={600} tt="uppercase" style={{ color: "var(--upgrade-card-text-color, rgba(147, 197, 253, 0.9))" }}>
                      Upgrades to
                    </Text>
                    <IconArrowRight size={14} style={{ color: "var(--upgrade-card-icon-color, rgba(96, 165, 250, 0.8))" }} />
                    <Text size="sm" fw={700} c="white">
                      {upgradeInfo.upgradeUnit.name}
                    </Text>
                  </Group>
                  {upgradeInfo.upgradeTech.requirements && (
                    <Group gap={4}>
                      {upgradeInfo.upgradeTech.requirements.split("").map((char, i) => {
                        const iconMap: Record<string, string> = {
                          B: "/blue.png",
                          G: "/green.png",
                          R: "/red.png",
                          Y: "/yellow.png",
                        };
                        const src = iconMap[char];
                        if (!src) return null;
                        return (
                          <Image
                            key={`${char}-${i}`}
                            src={src}
                            alt={`${char} prerequisite`}
                            w={14}
                            h={14}
                          />
                        );
                      })}
                    </Group>
                  )}
                </Group>
                {upgradeInfo.upgradeUnit.ability && (
                  <Text size="xs" c="gray.3" style={{ whiteSpace: "pre-line" }}>
                    {upgradeInfo.upgradeUnit.ability}
                  </Text>
                )}
                <Divider c="gray.7" opacity={0.4} />
                <Group gap={4} justify="space-between">
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase">Cost</Text>
                  <Text size="xs" fw={600} c="white">{upgradeInfo.upgradeUnit.cost ?? "—"}</Text>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase">Combat</Text>
                  <Text size="xs" fw={600} c="white">
                    {upgradeInfo.upgradeUnit.combatHitsOn ?? "—"}
                    {upgradeInfo.upgradeUnit.combatDieCount && upgradeInfo.upgradeUnit.combatDieCount > 1 && ` (x${upgradeInfo.upgradeUnit.combatDieCount})`}
                  </Text>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase">Move</Text>
                  <Text size="xs" fw={600} c="white">{upgradeInfo.upgradeUnit.moveValue ?? "—"}</Text>
                  <Text size="xs" fw={600} c="gray.3" tt="uppercase">Cap</Text>
                  <Text size="xs" fw={600} c="white">{upgradeInfo.upgradeUnit.capacityValue ?? "—"}</Text>
                </Group>
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
