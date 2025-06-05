import { Box, Stack, Group } from "@mantine/core";
import { Caption } from "../Caption";
import { DebtToken } from "../DebtToken";
import { cdnImage } from "../../../data/cdnImage";

type Props = {
  debts: Record<string, number>;
};

export function DebtTokens({ debts }: Props) {
  const debtEntries = Object.entries(debts);

  if (debtEntries.length === 0) {
    return null;
  }

  return (
    <Box
      p="sm"
      mx="-md"
      mb="-md"
      style={{
        borderRadius: "0 0 12px 12px",
        background:
          "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(239, 68, 68, 0.08) 100%)",
        borderTop: "1px solid rgba(239, 68, 68, 0.15)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle inner glow */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Stack gap="xs" style={{ position: "relative", zIndex: 1 }}>
        <Caption color="red.3">Debt</Caption>
        <Group gap={0}>
          {/* Render debt tokens */}
          {debtEntries.flatMap(([factionName, amount]) =>
            Array(amount)
              .fill(null)
              .map((_, index) => (
                <DebtToken
                  key={`${factionName}-${index}`}
                  factionIcon={cdnImage(`/factions/${factionName}.png`)}
                />
              ))
          )}
        </Group>
      </Stack>
    </Box>
  );
}
