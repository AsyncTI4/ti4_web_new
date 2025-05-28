import { Stack, Box, Image, Group, Text, Flex } from "@mantine/core";
import { units } from "../../data/units";

type Props = {
  unitId: string;
  maxReinforcements?: number;
};

// Helper function to get unit data by ID
const getUnitData = (unitId: string) => {
  return units.find((unit) => unit.id === unitId);
};

export function UnitCard({ unitId, maxReinforcements = 8 }: Props) {
  const unitData = getUnitData(unitId);

  if (!unitData) {
    return null; // or some fallback UI
  }

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;

  // For now, set reinforcements to a default value since it's not in the data structure yet
  const reinforcements = 3; // This would come from game state in the future

  const colors = isUpgraded
    ? {
        background: `linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.15) 30%, rgba(29, 78, 216, 0.20) 70%, rgba(59, 130, 246, 0.25) 100%)`,
        border: `1px solid rgba(59, 130, 246, 0.6)`,
        shadow: `0 6px 20px rgba(59, 130, 246, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(59, 130, 246, 0.4)`,
        highlight: `linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.8) 50%, transparent 100%)`,
        glow: "none",
      }
    : {
        background: `linear-gradient(135deg, rgba(107, 114, 128, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)`,
        border: `1px solid rgba(107, 114, 128, 0.3)`,
        shadow: `0 2px 8px rgba(107, 114, 128, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        highlight: `linear-gradient(90deg, transparent 0%, rgba(107, 114, 128, 0.4) 50%, transparent 100%)`,
        glow: "none",
      };

  return (
    <Stack
      py={6}
      px={4}
      gap={4}
      justify="space-between"
      pos="relative"
      style={{
        borderRadius: "8px",
        background: colors.background,
        border: colors.border,
        overflow: "hidden",
        boxShadow: colors.shadow,
      }}
    >
      {/* Enhanced top highlight */}
      <Box
        pos="absolute"
        top={0}
        left="20%"
        right="20%"
        h="1px"
        style={{
          background: colors.highlight,
        }}
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
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.1) 50%, transparent 100%)",
              animation: "shimmer 5s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Faction icon badge for faction-specific units */}
      {isFaction && (
        <Box
          pos="absolute"
          top="4px"
          right="4px"
          style={{
            zIndex: 10,
          }}
        >
          <Image
            src={`/${unitData.faction?.toLowerCase()}.png`}
            w="16px"
            h="16px"
            style={{
              filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))",
            }}
          />
        </Box>
      )}

      <Flex justify="center">
        <Image src={`/units/pnk_${unitData.asyncId}.png`} h="30px" />
      </Flex>

      <Stack gap={2} align="center">
        <Group gap={8} justify="center" align="baseline">
          {/* Reinforcements - always shown */}
          <Group gap={3} align="baseline">
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
                fz="10px"
                lh={1}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                /{maxReinforcements}
              </Text>
            </Group>
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
