import { Box, Group } from "@mantine/core";

type Props = {
  techType: string;
};

export function PhantomTech({ techType }: Props) {
  return (
    <Box
      py={1}
      px="xs"
      style={{
        borderRadius: "4px",
        border: "1px dashed rgba(156, 163, 175, 0.6)",
        position: "relative",
        overflow: "hidden",
        opacity: 0.3,
        height: "20.8px", // Fixed height to match Tech component
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          background: "rgba(156, 163, 175, 0.3)",
        }}
      />
      <Group
        gap={4}
        style={{ position: "relative", minWidth: 0, height: "100%" }}
      >
        <Box
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "2px",
            border: "1px dashed rgba(156, 163, 175, 0.4)",
            flexShrink: 0,
          }}
        />
        <Box
          style={{
            flex: 1,
            height: "6px",
            borderRadius: "2px",
            border: "1px dashed rgba(156, 163, 175, 0.4)",
          }}
        />
      </Group>
    </Box>
  );
}
