import { Box, Text, Image } from "@mantine/core";

export function UnscoredSecret() {
  return (
    <Box
      py={2}
      px={6}
      style={{
        borderRadius: "var(--mantine-radius-sm)",
        border: "1px rgba(184, 148, 148, 0.7)",
        background: "rgba(42, 15, 15, 0.6)",
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
            opacity: 0.8,
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
            opacity: 0.9,
          }}
        >
          Unscored Secret
        </Text>
      </Box>
    </Box>
  );
}
