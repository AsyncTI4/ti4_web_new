import { Box, Text } from "@mantine/core";

type Props = {
  status: "active" | "passed" | "next" | "waiting";
  text?: string;
};

const statusConfig = {
  active: {
    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.06) 100%)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
    boxShadow:
      "0 2px 8px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    textColor: "green.3",
    defaultText: "ACTIVE",
  },
  passed: {
    background:
      "linear-gradient(135deg, rgba(107, 114, 128, 0.12) 0%, rgba(75, 85, 99, 0.06) 100%)",
    border: "1px solid rgba(107, 114, 128, 0.25)",
    boxShadow:
      "0 2px 8px rgba(107, 114, 128, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    textColor: "gray.4",
    defaultText: "PASSED",
  },
  next: {
    background:
      "linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(75, 85, 99, 0.04) 100%)",
    border: "1px solid rgba(107, 114, 128, 0.2)",
    boxShadow:
      "0 2px 8px rgba(107, 114, 128, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    textColor: "gray.5",
    defaultText: "NEXT UP",
  },
  waiting: {
    background:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.06) 100%)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    boxShadow:
      "0 2px 8px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    textColor: "blue.4",
    defaultText: "WAITING",
  },
};

export function StatusBadge({ status, text }: Props) {
  const config = statusConfig[status];
  const displayText = text || config.defaultText;

  return (
    <Box
      px={8}
      py={2}
      style={{
        borderRadius: "6px",
        background: config.background,
        border: config.border,
        boxShadow: config.boxShadow,
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
