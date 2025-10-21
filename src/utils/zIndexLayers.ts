/**
 * Unit Z-Index Stacking System
 *
 * This file handles unit stacking logic and z-index calculations for game units.
 * All other z-index values should use CSS variables from zIndexVariables.css
 */

export const Z_INDEX_LAYERS = {
  // Game Units Layer (100-999)
  UNIT_BASE: 50,

  // Unit type priorities (higher number = higher z-index)
  // Based on actual TI4 unit types from entityZStackPriority
  UNIT_PRIORITIES: {
    // Special tokens (lower than units)
    THUNDERS_EDGE: 30, // Thunder's Edge token - renders below other tokens

    // Regular units
    GF: 100, // Ground Forces
    FF: 110, // Fighters
    MF: 120, // Mechs
    SD: 130, // Space Docks
    PD: 140, // PDS
    DD: 150, // Destroyers
    CV: 160, // Carriers
    CA: 170, // Cruisers
    DN: 180, // Dreadnoughts
    FS: 190, // Flagships
    WS: 200, // War Suns
  },
} as const;

/**
 * Calculate z-index for a unit based on its type and stack position
 */
export function getUnitZIndex(
  unitType: string | null | undefined,
  stackIndex: number = 0
): number {
  if (!unitType) {
    return Z_INDEX_LAYERS.UNIT_BASE + stackIndex;
  }

  const capitalizedUnitType = unitType.toUpperCase().replace(/_/g, "_");
  const basePriority =
    Z_INDEX_LAYERS.UNIT_PRIORITIES[
      capitalizedUnitType as keyof typeof Z_INDEX_LAYERS.UNIT_PRIORITIES
    ] || Z_INDEX_LAYERS.UNIT_BASE;
  return basePriority + stackIndex;
}

// Legacy compatibility - keep existing entity base z-index function
export const entityBaseZIndex = (entityType: string) => {
  return getUnitZIndex(entityType, 0);
};
