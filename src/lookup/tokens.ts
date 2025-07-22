import { tokens } from "@/data/tokens";

/**
 * Look up attachment data by ID
 */
export const getTokenData = (tokenId: string) =>
  tokens.find((token) => token.id === tokenId);

/**
 * Get the image path for an attachment by ID
 */
export const getTokenImagePath = (tokenId: string): string | null => {
  const tokenData = getTokenData(tokenId);
  if (!tokenData) return null;
  return `/tokens/${tokenData?.imagePath}`;
};
