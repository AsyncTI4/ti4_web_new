import { cdnImage } from "@/entities/data/cdnImage";
import { getTokenImagePath } from "@/entities/lookup/tokens";
import { StackedTokenStrip } from "../ReinforcementTokens/StackedTokenStrip";

type SleeperTokensProps = {
  count: number;
};

export function SleeperTokens({ count }: SleeperTokensProps) {
  if (count <= 0) return null;

  const tokenPath = getTokenImagePath("sleeper");
  if (!tokenPath) return null;

  const tokens = Array.from({ length: count }).map((_, index) => ({
    key: index,
    src: cdnImage(tokenPath),
    alt: "Sleeper Token",
  }));

  return <StackedTokenStrip tokens={tokens} />;
}
