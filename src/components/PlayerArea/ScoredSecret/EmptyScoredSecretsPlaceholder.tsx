import { Box, Text, Image } from "@mantine/core";

export function EmptyScoredSecretsPlaceholder() {
  return (
    <Box
      py={2}
      px={6}
      style={{
        borderRadius: "var(--mantine-radius-sm)",
        border: "1px dashed rgba(148, 163, 184, 0.4)",
        background: "rgba(15, 23, 42, 0.3)",
        position: "relative",
      }}
    >
      <Box
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <Image
          src="/so_icon.png"
          style={{
            width: "20px",
            height: "20px",
            flexShrink: 0,
            opacity: 0.3,
            filter: "grayscale(1)",
          }}
        />
        <Text
          size="xs"
          fw={500}
          c="gray.6"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: 1,
            fontStyle: "italic",
            opacity: 0.7,
          }}
        >
          No scored secrets
        </Text>
      </Box>
    </Box>
  );
}
