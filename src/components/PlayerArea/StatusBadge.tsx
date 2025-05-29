import { Box, Text } from "@mantine/core";
import { getGradientConfig } from "./gradients";

type Props = {
  status: "active" | "passed" | "next" | "waiting";
  text?: string;
};

const statusConfig = {
  active: {
    color: "green" as const,
    textColor: "green.3",
    defaultText: "ACTIVE",
  },
  passed: {
    color: "grey" as const,
    textColor: "gray.4",
    defaultText: "PASSED",
  },
  next: {
    color: "gray" as const,
    textColor: "gray.5",
    defaultText: "NEXT UP",
  },
  waiting: {
    color: "blue" as const,
    textColor: "blue.4",
    defaultText: "WAITING",
  },
};

export function StatusBadge({ status, text }: Props) {
  const config = statusConfig[status];
  const gradientConfig = getGradientConfig(config.color);
  const displayText = text || config.defaultText;

  return (
    <Box
      px={8}
      py={2}
      style={{
        borderRadius: "6px",
        background: gradientConfig.background,
        border: `1px solid ${gradientConfig.border}`,
        boxShadow: gradientConfig.shadow,
      }}
    >
      <Text
        size="xs"
        fw={700}
        c={config.textColor}
        style={{
          textTransform: "uppercase",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
          letterSpacing: "0.5px",
          fontSize: "10px",
        }}
      >
        {displayText}
      </Text>
    </Box>
  );
}
