import { hyperlaneIds, hyperlanes } from "@/entities/data/hyperlanes";
import {
  CUSTOM_HYPERLANE_TILE_ID,
  getMatrixActiveSides,
} from "@/entities/game/customHyperlanes";

export const isHyperlane = (systemId: string | undefined) =>
  !!systemId &&
  (systemId === CUSTOM_HYPERLANE_TILE_ID || hyperlaneIds.includes(systemId));

/**
 * Sides a hyperlane tile actually connects through. Custom ("hl") tiles take
 * their matrix from the game; the official tiles from the static table.
 */
export const getHyperlaneActiveSides = (
  hyperlaneId: string,
  customMatrix?: string,
): Set<number> =>
  getMatrixActiveSides(
    hyperlaneId === CUSTOM_HYPERLANE_TILE_ID
      ? customMatrix
      : hyperlanes[hyperlaneId],
  );
