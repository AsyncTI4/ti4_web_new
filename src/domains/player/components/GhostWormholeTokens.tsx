import { cdnImage } from "@/entities/data/cdnImage";
import { getTokenImagePath } from "@/entities/lookup/tokens";
import {
  type TokenDescriptor,
  StackedTokenStrip,
} from "./StackedTokenStrip";

type GhostWormholeTokensProps = {
  wormholeIds: string[];
};

export function GhostWormholeTokens({ wormholeIds }: GhostWormholeTokensProps) {
  if (!wormholeIds || wormholeIds.length === 0) return null;

  const tokens = wormholeIds.reduce<TokenDescriptor[]>((acc, wormholeId, index) => {
    const tokenPath = getTokenImagePath(wormholeId);
    if (!tokenPath) return acc;
    acc.push({
      key: `${wormholeId}-${index}`,
      src: cdnImage(tokenPath),
      alt: `${wormholeId} Token`,
    });
    return acc;
  }, []);

  if (tokens.length === 0) return null;

  return <StackedTokenStrip tokens={tokens} />;
}
