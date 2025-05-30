import { Stack, Box, Image, Group, Text, Flex } from "@mantine/core";
import { units } from "../../data/units";
import { colors } from "../../data/colors";
import styles from "./UnitCard.module.css";
import { cdnImage } from "../../data/cdnImage";

type Props = {
  unitId: string;
  color?: string;
  deployedCount: number;
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
};

export function UnitCard({ unitId, color, deployedCount }: Props) {
  const unitData = getUnitData(unitId);
  const colorAlias = getColorAlias(color);

  if (!unitData) return null; // or some fallback UI

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;

  const cardClass = isUpgraded
    ? `${styles.unitCard} ${styles.upgraded}`
    : `${styles.unitCard} ${styles.standard}`;
  const highlightClass = isUpgraded
    ? styles.highlight
    : styles.highlightStandard;

  const unitCap =
    DEFAULT_UNIT_CAPS[unitData.baseType as keyof typeof DEFAULT_UNIT_CAPS];

  const reinforcements =
    unitData.baseType === "fighter" || unitData.baseType === "infantry"
      ? "∞"
      : unitCap - deployedCount;

  return (
    <Stack
      py={6}
      px={4}
      gap={4}
      justify="space-between"
      pos="relative"
      className={cardClass}
    >
      {/* Enhanced top highlight */}
      <Box
        pos="absolute"
        top={0}
        left="20%"
        right="20%"
        h="1px"
        className={highlightClass}
      />

      {/* Upgraded unit special effects */}
      {isUpgraded && (
        <>
          {/* Glassy sheen effect */}
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.08) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Subtle inner glow */}
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Animated shimmer effect */}
          <Box
            pos="absolute"
            top={0}
            left="-100%"
            w="100%"
            h="100%"
            className={styles.shimmerEffect}
          />
        </>
      )}

      {/* Faction icon badge for faction-specific units */}
      {isFaction && (
        <Box
          pos="absolute"
          top={0}
          right={0}
          style={{
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Image
            src={cdnImage(`/factions/${unitData.faction?.toLowerCase()}.png`)}
            w="24px"
            h="24px"
          />
        </Box>
      )}

      <Flex justify="center">
        <Image
          src={cdnImage(`/units/${colorAlias}_${unitData.asyncId}.png`)}
          w="30px"
        />
      </Flex>

      <Stack gap={2} align="center">
        <Group gap={8} justify="center" align="baseline">
          {/* Reinforcements - show infinity for fighters and infantry, normal count for others */}
          <Group gap={3} align="baseline">
            {unitData.baseType === "fighter" ||
            unitData.baseType === "infantry" ? (
              <Text
                size="lg"
                c="white"
                fw={700}
                fz="18px"
                lh={1}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                ∞
              </Text>
            ) : (
              <Group gap={2} align="baseline">
                <Text
                  size="xs"
                  c="white"
                  fw={700}
                  fz="14px"
                  lh={1}
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {reinforcements}
                </Text>
                <Text
                  size="xs"
                  c="gray.5"
                  fw={500}
                  lh={1}
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  /{unitCap}
                </Text>
              </Group>
            )}
          </Group>

          {/* Captured - commented out for now as requested */}
          {/* {captured > 0 && (
            <Group gap={3} align="baseline">
              <Text
                size="xs"
                c="red.3"
                fw={600}
                fz="9px"
                lh={1}
                tt="uppercase"
                style={{
                  textShadow:
                    "0 0 3px rgba(239, 68, 68, 0.8), 0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                C
              </Text>
              <Text
                size="sm"
                c="red.4"
                fw={700}
                lh={1}
                style={{
                  textShadow:
                    "0 0 4px rgba(239, 68, 68, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {captured}
              </Text>
            </Group>
          )} */}
        </Group>
      </Stack>
    </Stack>
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
