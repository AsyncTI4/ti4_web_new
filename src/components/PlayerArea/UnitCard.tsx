import { Stack, Box, Image, Group, Text, Flex } from "@mantine/core";
import { units } from "../../data/units";
import { unitCardClasses } from "./gradientClasses";

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

  const cardClass = isUpgraded
    ? unitCardClasses.upgraded
    : unitCardClasses.standard;
  const highlightClass = isUpgraded
    ? unitCardClasses.highlight
    : unitCardClasses.highlightStandard;

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
          top={0}
          right={0}
          style={{
            zIndex: 2,
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "50%",
          }}
        >
          <Image
            src={`/factions/${unitData.faction?.toLowerCase()}.png`}
            w="24px"
            h="24px"
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
                ?{/* {reinforcements} */}
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
                /?
                {/* /{maxReinforcements} */}
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
