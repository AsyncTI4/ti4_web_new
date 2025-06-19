import { Group, Text, Image, Box } from "@mantine/core";

export function EmptyPromissoryNotePlaceholder() {
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
      <Group gap="xs" align="center" wrap="nowrap" style={{ minWidth: 0 }}>
        <Image
          src="/pnicon.png"
          style={{
            width: "20px",
            flexShrink: 0,
            opacity: 0.3,
            filter: "grayscale(1)",
          }}
        />
        <Text
          size="xs"
          c="gray.6"
          flex={1}
          style={{
            fontFamily: "SLIDER, monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
            fontStyle: "italic",
            opacity: 0.7,
          }}
        >
          No promissory notes in play
        </Text>
      </Group>
    </Box>
  );
}
