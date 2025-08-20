import { Box, Text, Image, BoxProps } from "@mantine/core";
import { ReactNode } from "react";

type Props = BoxProps & {
  src: string;
  alt: string;
  count: string | number | ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  addBorder?: boolean;
  style?: React.CSSProperties;
};

export function Cardback({
  src,
  alt,
  count,
  size = "sm",
  addBorder = false,
  style,
  ...boxProps
}: Props) {
  const widthMap = {
    xs: "35px",
    sm: "45px",
    md: "55px",
    lg: "65px",
  };

  return (
    <Box pos="relative" maw={widthMap[size]}>
      <Box
        style={{
          width: widthMap[size],
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
          border: addBorder ? "1px solid rgba(148, 163, 184, 0.2)": "",
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
