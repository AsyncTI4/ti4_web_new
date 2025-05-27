import { Box, Stack, Group } from "@mantine/core";
import { Caption } from "./Caption";
import { DebtToken } from "./DebtToken";

type Props = {
  debts: Array<{
    factionIcon: string;
    amount?: number;
  }>;
};

export function DebtTokens({ debts }: Props) {
  if (debts.length === 0) {
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
          {debts.map((debt, index) => (
            <DebtToken
              key={index}
              factionIcon={debt.factionIcon}
              amount={debt.amount}
            />
          ))}
        </Group>
      </Stack>
    </Box>
  );
}
