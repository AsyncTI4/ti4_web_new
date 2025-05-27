import { Stack, Box, Image, Group, Text } from "@mantine/core";

type Props = {
  unit: {
    name: string;
    type: string;
    reinforcements: number;
    captured: number;
    isUpgraded?: boolean;
    isFaction?: boolean;
    factionIcon?: string;
  };
  getUnitImageName: (unitType: string) => string;
  maxReinforcements?: number;
};

export function UnitCard({
  unit,
  getUnitImageName,
  maxReinforcements = 8,
}: Props) {
  const isUpgraded = unit.isUpgraded || false;
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
      px={0}
      gap={2}
      justify="space-between"
      style={{
        borderRadius: "8px",
        background: colors.background,
        border: colors.border,
        position: "relative",
        overflow: "hidden",
        boxShadow: colors.shadow,
      }}
    >
      {/* Enhanced top highlight */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "1px",
          background: colors.highlight,
        }}
      />

      {/* Upgraded unit special effects */}
      {isUpgraded && (
        <>
          {/* Glassy sheen effect */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.08) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Subtle inner glow */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Animated shimmer effect */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.1) 50%, transparent 100%)",
              animation: "shimmer 5s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Red glow for captured units - bottom only */}
      {unit.captured > 0 && (
        <>
          {/* Radial red glow from bottom center */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isUpgraded
                ? "radial-gradient(ellipse 120% 80% at center bottom, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.08) 40%, rgba(239, 68, 68, 0.04) 60%, transparent 80%)"
                : "radial-gradient(ellipse 120% 80% at center bottom, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.06) 40%, rgba(239, 68, 68, 0.03) 60%, transparent 80%)",
              pointerEvents: "none",
              borderRadius: "8px",
            }}
          />

          {/* Additional inner glow */}
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: isUpgraded
                ? "radial-gradient(ellipse 100% 100% at center bottom, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.04) 50%, transparent 70%)"
                : "radial-gradient(ellipse 100% 100% at center bottom, rgba(239, 68, 68, 0.06) 0%, rgba(239, 68, 68, 0.03) 50%, transparent 70%)",
              pointerEvents: "none",
              borderRadius: "0 0 8px 8px",
            }}
          />

          {/* Bottom edge highlight */}
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.5) 50%, rgba(239, 68, 68, 0.4) 100%)",
              pointerEvents: "none",
              borderRadius: "0 0 8px 8px",
              boxShadow: "0 0 4px rgba(239, 68, 68, 0.2)",
            }}
          />
        </>
      )}

      {/* Faction icon badge for faction-specific units */}
      {unit.isFaction && unit.factionIcon && (
        <Box
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            zIndex: 10,
          }}
        >
          <Image
            src={unit.factionIcon}
            style={{
              width: "16px",
              height: "16px",
              filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))",
            }}
          />
        </Box>
      )}

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={`/units/pnk_${getUnitImageName(unit.type)}.png`}
          style={{
            height: "22px",
            marginLeft: -10,
            marginRight: -10,
          }}
        />
      </Box>

      <Stack gap={2} align="center">
        <Group gap={8} justify="center" align="baseline">
          {/* Reinforcements - always shown */}
          <Group gap={3} align="baseline">
            <Group gap={2} align="baseline">
              <Text
                size="xs"
                c="white"
                fw={700}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  lineHeight: 1,
                  fontSize: "14px",
                }}
              >
                {unit.reinforcements}
              </Text>
              <Text
                size="xs"
                c="gray.5"
                fw={500}
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  lineHeight: 1,
                  fontSize: "10px",
                }}
              >
                /{maxReinforcements}
              </Text>
            </Group>
          </Group>

          {/* Captured - only show if > 0 */}
          {unit.captured > 0 && (
            <Group gap={3} align="baseline">
              <Text
                size="xs"
                c="red.3"
                fw={600}
                style={{
                  fontSize: "9px",
                  lineHeight: 1,
                  textTransform: "uppercase",
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
                style={{
                  textShadow:
                    "0 0 4px rgba(239, 68, 68, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)",
                  lineHeight: 1,
                }}
              >
                {unit.captured}
              </Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Stack>
  );
}
