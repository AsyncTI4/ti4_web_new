import { Box, Text, BoxProps } from "@mantine/core";

type PatternType = "none" | "grid" | "circle";

type Props = BoxProps & {
  children: React.ReactNode;
  pattern?: PatternType;
  label?: string;
  cornerAccents?: boolean;
};

export function Surface({
  children,
  pattern = "none",
  label,
  cornerAccents = false,
  ...boxProps
}: Props) {
  const getPatternOverlay = () => {
    switch (pattern) {
      case "grid":
        return {
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        };
      case "circle":
        return {
          backgroundColor: "rgba(148, 163, 184, 0.02)",
          backgroundImage:
            "repeating-radial-gradient(circle at 0 0, transparent 0, rgba(148, 163, 184, 0.02) 10px), repeating-linear-gradient(rgba(148, 163, 184, 0.03), rgba(148, 163, 184, 0.01))",
        };
      default:
        return {};
    }
  };

  return (
    <Box
      {...boxProps}
      style={{
        borderRadius: "12px",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
        ...boxProps.style,
      }}
    >
      {/* Pattern overlay */}
      {pattern !== "none" && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            opacity: 0.5,
            ...getPatternOverlay(),
          }}
        />
      )}

      {/* Corner accents */}
      {cornerAccents && (
        <>
          <Box
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "20px",
              height: "20px",
              border: "2px solid rgba(59, 130, 246, 0.1)",
              borderRight: "none",
              borderBottom: "none",
              borderRadius: "4px 0 0 0",
            }}
          />
          <Box
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "20px",
              height: "20px",
              border: "2px solid rgba(59, 130, 246, 0.1)",
              borderLeft: "none",
              borderBottom: "none",
              borderRadius: "0 4px 0 0",
            }}
          />
          <Box
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              width: "20px",
              height: "20px",
              border: "2px solid rgba(59, 130, 246, 0.1)",
              borderRight: "none",
              borderTop: "none",
              borderRadius: "0 0 0 4px",
            }}
          />
          <Box
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              width: "20px",
              height: "20px",
              border: "2px solid rgba(59, 130, 246, 0.1)",
              borderLeft: "none",
              borderTop: "none",
              borderRadius: "0 0 4px 0",
            }}
          />
        </>
      )}

      {/* Label */}
      {label && (
        <Text
          size="xs"
          fw={700}
          c="blueGray.3"
          style={{
            textTransform: "uppercase",
            bottom: 15,
            position: "absolute",
            right: 20,
            zIndex: 1,
          }}
        >
          {label}
        </Text>
      )}

      {children}
    </Box>
  );
}
