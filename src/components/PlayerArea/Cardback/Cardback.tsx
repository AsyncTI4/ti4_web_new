import { Box, Text, Image, BoxProps } from "@mantine/core";

type Props = BoxProps & {
  src: string;
  alt: string;
  count: string | number;
  style?: React.CSSProperties;
};

export function Cardback({ src, alt, count, style, ...boxProps }: Props) {
  return (
    <Box pos="relative" {...boxProps}>
      <Box
        style={{
          width: "45px",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
          ...style,
        }}
      >
        <Image
          src={src}
          alt={alt}
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
          }}
        />
      </Box>
      <Box
        style={{
          position: "absolute",
          bottom: "4px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
          borderRadius: "4px",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
          minWidth: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        px={6}
        py={1}
      >
        <Text
          size="lg"
          fw={700}
          c="white"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            lineHeight: 1,
          }}
        >
          {(count || 0).toString()}
        </Text>
      </Box>
    </Box>
  );
}
