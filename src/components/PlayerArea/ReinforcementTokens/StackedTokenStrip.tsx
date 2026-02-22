import { Box } from "@mantine/core";
import type { Key } from "react";

export type TokenDescriptor = {
  key: Key;
  src: string;
  alt: string;
};

export type StackedTokenStripProps = {
  tokens: TokenDescriptor[];
  horizontalSpacing?: number;
  verticalOffset?: number;
  tokenWidth?: number;
  maxWidth?: number;
  height?: number;
};

const DEFAULT_HEIGHT = 110;
const DEFAULT_SPACING = 35;
const DEFAULT_VERTICAL_OFFSET = 25;
const DEFAULT_TOKEN_WIDTH = 32;
const DEFAULT_MAX_WIDTH = 280;

export function StackedTokenStrip({
  tokens,
  horizontalSpacing = DEFAULT_SPACING,
  verticalOffset = DEFAULT_VERTICAL_OFFSET,
  tokenWidth = DEFAULT_TOKEN_WIDTH,
  maxWidth = DEFAULT_MAX_WIDTH,
  height = DEFAULT_HEIGHT,
}: StackedTokenStripProps) {
  if (!tokens || tokens.length === 0) return null;

  const stripWidth = Math.min(tokens.length * horizontalSpacing, maxWidth);

  return (
    <Box
      style={{
        position: "relative",
        height,
        width: stripWidth,
      }}
    >
      {tokens.map((token, index) => (
        <img
          key={token.key ?? index}
          src={token.src}
          alt={token.alt}
          style={{
            position: "absolute",
            width: tokenWidth,
            left: index * horizontalSpacing,
            top: verticalOffset * ((index + 1) % 2),
          }}
        />
      ))}
    </Box>
  );
}
