import { Box, Text, Image, BoxProps } from "@mantine/core";
import hierarchy from "../../shared/primitives/Hierarchy.module.css";
import { ReactNode } from "react";

type Props = BoxProps & {
  src: string;
  alt: string;
  count: string | number | ReactNode;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
};

export function Cardback({
  src,
  alt,
  count,
  size = "sm",
  style,
  ...boxProps
}: Props) {
  const widthMap = {
    sm: "45px",
    md: "55px",
    lg: "65px",
  };

  return (
    <Box pos="relative" {...boxProps}>
      <Box
        className={`${hierarchy.chip} ${hierarchy.chipOutline} ${hierarchy.chipGlowHover} ${hierarchy.hoverOutline} ${hierarchy.hoverOutlineBlue}`}
        style={{
          width: widthMap[size],
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
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
        {typeof count === "string" || typeof count === "number" ? (
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
        ) : (
          count
        )}
      </Box>
    </Box>
  );
}
