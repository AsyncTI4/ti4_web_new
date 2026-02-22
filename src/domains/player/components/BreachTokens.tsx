import { cdnImage } from "@/entities/data/cdnImage";
import { StackedTokenStrip } from "./StackedTokenStrip";

type BreachTokensProps = {
  count: number;
};

export function BreachTokens({ count }: BreachTokensProps) {
  if (count <= 0) return null;

  const tokens = Array.from({ length: count }).map((_, index) => ({
    key: index,
    src: cdnImage("/tokens/token_breachActive.webp"),
    alt: "Breach Token",
  }));

  return <StackedTokenStrip tokens={tokens} />;
}
