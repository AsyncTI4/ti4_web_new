import {
  getTokenSpriteFrame,
  type SpriteFrame,
} from "@/entities/data/renderedSpriteDimensions";

export type TokenSpriteKind = "token" | "attachment";

export type TokenSprite = SpriteFrame & {
  kind: TokenSpriteKind;
  id: string;
};

export function getTokenSprite(
  kind: TokenSpriteKind,
  id: string
): TokenSprite | undefined {
  const frame = getTokenSpriteFrame(kind, id);
  return frame && { kind, id, ...frame };
}
