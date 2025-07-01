import { Box, Text, Stack, Group, Image, Divider } from "@mantine/core";
import { units } from "@/data/units";
import { cdnImage } from "@/data/cdnImage";
import { findColorData } from "@/lookup/colors";
import { Dice } from "./Dice";

type Props = {
  unitId: string;
  color?: string;
};

export function UnitDetailsCard({ unitId, color }: Props) {
  // Look up unit data
  const unitData = units.find((unit) => unit.id === unitId);

  if (!unitData) {
    console.warn(`Unit with ID "${unitId}" not found`);
    return null;
  }

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;

  // Get color alias for unit image
  const getColorAlias = (color?: string) => {
    if (!color) return "pnk"; // default fallback

    const colorData = findColorData(color);
    return colorData?.alias || "pnk"; // fallback to pink if color not found
  };

  const colorAlias = getColorAlias(color);

  return (
    <Box
      pos="relative"
      w={380}
      miw={380}
      // mih={220}
      p="md"
      bg="linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      style={{
        border: isUpgraded
          ? "1px solid rgba(59, 130, 246, 0.4)"
          : "1px solid rgba(148, 163, 184, 0.3)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
    >
      <Stack gap="md" h="100%">
        {/* Header */}
        <Group gap="md" align="flex-start">
          <Box
            w={60}
            h={60}
            style={{
              borderRadius: "50%",
              background: isUpgraded
                ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)"
                : "linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(107, 114, 128, 0.15) 100%)",
              border: isUpgraded
                ? "2px solid rgba(59, 130, 246, 0.4)"
                : "2px solid rgba(148, 163, 184, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={cdnImage(`/units/${colorAlias}_${unitData.asyncId}.png`)}
              w={35}
              h={35}
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))",
              }}
            />
          </Box>
          <Stack gap={4} flex={1}>
            <Text
              size="lg"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {unitData.name}
            </Text>

            <Text
              size="xs"
              c={isUpgraded ? "blue.3" : "gray.4"}
              fw={600}
              tt="uppercase"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              {isUpgraded ? "Upgraded Unit" : "Standard Unit"}
            </Text>
          </Stack>

          {/* Faction icon for faction-specific units */}
          {isFaction && (
            <Box
              pos="absolute"
              top={12}
              right={12}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "4px",
                padding: "2px",
              }}
            >
              <Image
                src={cdnImage(
                  `/factions/${unitData.faction?.toLowerCase()}.png`
                )}
                alt={`${unitData.faction} faction`}
                w={24}
                h={24}
              />
            </Box>
          )}
        </Group>

        {/* General Ability Text Section */}
        {unitData.ability && (
          <>
            <Divider c={isUpgraded ? "blue.7" : "gray.7"} opacity={0.4} />
            <Box p="md">
              <Text
                size="sm"
                fw={500}
                c="gray.2"
                lh={1.5}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                }}
              >
                {unitData.ability}
              </Text>
            </Box>
          </>
        )}

        {/* Abilities Section */}
        {(unitData.afbHitsOn ||
          unitData.bombardHitsOn ||
          unitData.spaceCannonHitsOn ||
          unitData.planetaryShield ||
          unitData.sustainDamage) && (
          <>
            <Divider c={isUpgraded ? "blue.7" : "gray.7"} opacity={0.4} />
            <Box>
              <Stack gap={2}>
                {unitData.afbHitsOn && (
                  <Group gap="xs" justify="flex-start">
                    <Text
                      size="xs"
                      fw={600}
                      c="gray.3"
                      tt="uppercase"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Anti-Fighter Barrage
                    </Text>
                    <Text
                      size="sm"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {unitData.afbHitsOn}
                      {unitData.afbDieCount &&
                        unitData.afbDieCount > 1 &&
                        ` (x${unitData.afbDieCount})`}
                    </Text>
                  </Group>
                )}
                {unitData.bombardHitsOn && (
                  <Group gap="xs" justify="flex-start">
                    <Text
                      size="xs"
                      fw={600}
                      c="gray.3"
                      tt="uppercase"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Bombardment
                    </Text>
                    <Text
                      size="xs"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {unitData.bombardHitsOn}
                      {unitData.bombardDieCount &&
                        unitData.bombardDieCount > 1 &&
                        ` (x${unitData.bombardDieCount})`}
                    </Text>
                  </Group>
                )}
                {unitData.spaceCannonHitsOn && (
                  <Group gap="xs" justify="flex-start">
                    <Text
                      size="xs"
                      fw={600}
                      c="gray.3"
                      tt="uppercase"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Space Cannon
                    </Text>
                    <Text
                      size="sm"
                      fw={700}
                      c="white"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {unitData.spaceCannonHitsOn}
                      {unitData.spaceCannonDieCount &&
                        unitData.spaceCannonDieCount > 1 &&
                        ` (x${unitData.spaceCannonDieCount})`}
                    </Text>
                  </Group>
                )}
                {unitData.planetaryShield && (
                  <Text
                    size="xs"
                    fw={600}
                    c="gray.3"
                    tt="uppercase"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Planetary Shield
                  </Text>
                )}
                {unitData.sustainDamage && (
                  <Text
                    size="xs"
                    fw={600}
                    c="gray.3"
                    tt="uppercase"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Sustain Damage
                  </Text>
                )}
              </Stack>
            </Box>
          </>
        )}

        <Divider c={isUpgraded ? "blue.7" : "gray.7"} opacity={0.4} />

        {/* Stats Section */}
        <Box>
          <Group gap="xs" justify="space-between">
            <Box ta="center" style={{ flex: 1 }}>
              <Text
                size="xs"
                fw={600}
                c="gray.3"
                tt="uppercase"
                mb={2}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                }}
              >
                Cost
              </Text>
              <Text
                size="lg"
                fw={700}
                c="white"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {unitData.cost ?? "—"}
              </Text>
            </Box>
            <Box ta="center" style={{ flex: 1 }}>
              <Text
                size="xs"
                fw={600}
                c="gray.3"
                tt="uppercase"
                mb={2}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                }}
              >
                Combat
              </Text>
              <Group gap="xs" justify="center" align="center">
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {unitData.combatHitsOn ?? "—"}
                </Text>
                <Dice count={unitData.combatDieCount || 1} />
              </Group>
            </Box>
            <Box ta="center" style={{ flex: 1 }}>
              <Text
                size="xs"
                fw={600}
                c="gray.3"
                tt="uppercase"
                mb={2}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                }}
              >
                Move
              </Text>
              <Text
                size="lg"
                fw={700}
                c="white"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {unitData.moveValue ?? "—"}
              </Text>
            </Box>
            <Box ta="center" style={{ flex: 1 }}>
              <Text
                size="xs"
                fw={600}
                c="gray.3"
                tt="uppercase"
                mb={2}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                }}
              >
                Capacity
              </Text>
              <Text
                size="lg"
                fw={700}
                c="white"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {unitData.capacityValue ?? "—"}
              </Text>
            </Box>
          </Group>
        </Box>
      </Stack>
    </Box>
  );
}
