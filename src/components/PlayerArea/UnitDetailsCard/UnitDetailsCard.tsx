import { Box, Text, Stack, Group, Image, Divider } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { getColorAlias } from "@/lookup/colors";
import { getUnitData } from "@/lookup/units";
import { DetailsCard } from "@/components/shared/DetailsCard";

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
      </Stack>
    </DetailsCard>
  );
}
