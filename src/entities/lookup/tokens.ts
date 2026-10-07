import { tokens } from "@/entities/data/tokens";
import { indexBy } from "@/entities/lookup/indexBy";

const tokensMap = indexBy(tokens, (token) => token.id);

export const getTokenData = (tokenId: string) => tokensMap.get(tokenId);

export const getTokenImagePath = (tokenId: string): string | null => {
  const tokenData = getTokenData(tokenId);
  if (!tokenData) return null;
  return `/tokens/${tokenData.imagePath}`;
};
