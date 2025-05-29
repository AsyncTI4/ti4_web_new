import { Box, Group, Text } from "@mantine/core";

type Props = {
  isVisible?: boolean;
};

export function SpeakerToken({ isVisible = false }: Props) {
  if (!isVisible) return null;

  return (
    <Box
      p={6}
      px={8}
      style={{
        borderRadius: "8px",
        background:
          "linear-gradient(145deg, rgba(15, 15, 20, 0.95) 0%, rgba(25, 25, 30, 0.9) 25%, rgba(20, 20, 25, 0.95) 50%, rgba(30, 30, 35, 0.9) 75%, rgba(15, 15, 20, 0.95) 100%)",
        border: "2px solid rgba(239, 68, 68, 0.8)",
        position: "relative",
        overflow: "hidden",
        minWidth: "90px",
        boxShadow:
          "inset 2px 2px 6px rgba(0, 0, 0, 0.8), inset -1px -1px 3px rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Shimmering red border overlay */}
      <Box
        style={{
          position: "absolute",
          top: "-1px",
          left: "-1px",
          right: "-1px",
          bottom: "-1px",
          borderRadius: "9px",
          background:
            "linear-gradient(45deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 1) 25%, rgba(239, 68, 68, 0.7) 50%, rgba(185, 28, 28, 0.9) 75%, rgba(239, 68, 68, 0.9) 100%)",
          padding: "2px",
          zIndex: -1,
        }}
      >
        <Box
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "7px",
            background:
              "linear-gradient(145deg, rgba(15, 15, 20, 0.95) 0%, rgba(25, 25, 30, 0.9) 25%, rgba(20, 20, 25, 0.95) 50%, rgba(30, 30, 35, 0.9) 75%, rgba(15, 15, 20, 0.95) 100%)",
          }}
        />
      </Box>

      {/* Brushed metal texture overlay */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.01) 1px,
              transparent 1px,
              transparent 2px,
              rgba(255, 255, 255, 0.015) 2px,
              rgba(255, 255, 255, 0.005) 3px,
              transparent 3px,
              transparent 4px
            )
          `,
          pointerEvents: "none",
        }}
      />

      {/* Top-right dark shadow for proper inset lighting */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "70%",
          height: "70%",
          background:
            "linear-gradient(225deg, rgba(0, 0, 0, 0.5) 0%, transparent 60%)",
          borderRadius: "0 8px 0 0",
          pointerEvents: "none",
        }}
      />

      {/* Bottom-left highlight for proper inset lighting */}
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "60%",
          height: "60%",
          background:
            "linear-gradient(45deg, rgba(255, 255, 255, 0.12) 0%, transparent 50%)",
          borderRadius: "0 0 0 8px",
          pointerEvents: "none",
        }}
      />

      {/* Red metallic glow */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Group
        justify="center"
        align="center"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Text
          ff="heading"
          c="red.2"
          size="sm"
          fw={700}
          style={{
            textTransform: "uppercase",
            textShadow:
              "1px 1px 0px rgba(0, 0, 0, 0.9), 2px 2px 3px rgba(0, 0, 0, 0.8), 0 0 6px rgba(239, 68, 68, 0.3)",
            letterSpacing: "1px",
            fontSize: "11px",
          }}
        >
          SPEAKER
        </Text>
      </Group>
    </Box>
  );
}
