import { Box, Text, Image } from "@mantine/core";

type Props = {
  name: string;
};

export function Relic({ name }: Props) {
  return (
    <Box
      py={4}
      px={6}
      style={{
        borderRadius: "6px",
        background:
          "linear-gradient(135deg, rgba(194, 65, 12, 0.15) 0%, rgba(234, 88, 12, 0.12) 50%, rgba(194, 65, 12, 0.15) 100%)",
        border: "1px solid rgba(251, 191, 36, 0.4)",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Diagonal stripe pattern */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(251, 191, 36, 0.08) 0px,
              rgba(251, 191, 36, 0.08) 1px,
              transparent 1px,
              transparent 16px
            )
          `,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Stronger inner glow */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "100%",
          position: "relative",
          zIndex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Image
          src="/relicicon.webp"
          style={{
            width: "16px",
            height: "16px",
            filter: "drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3))",
            flexShrink: 0,
          }}
        />
        <Text
          size="sm"
          fw={700}
          c="white"
          style={{
            fontFamily: "SLIDER, monospace",
            textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {name}
        </Text>
      </Box>
    </Box>
  );
}
