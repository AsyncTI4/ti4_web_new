import { cdnImage } from "@/entities/data/cdnImage";
import { StackedTokenStrip } from "./StackedTokenStrip";

type GalvanizeTokensProps = {
  count: number;
};

export function GalvanizeTokens({ count }: GalvanizeTokensProps) {
  if (count <= 0) return null;

  const tokens = Array.from({ length: count }).map((_, index) => ({
    key: index,
    src: cdnImage("/extra/marker_galvanize.png"),
    alt: "Galvanize Token",
  }));

  return (
    <StackedTokenStrip
      tokens={tokens}
      horizontalSpacing={18}
      verticalOffset={10}
      tokenWidth={24}
    />
  );
}
