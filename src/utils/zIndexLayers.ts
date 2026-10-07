/**
 * Unit stacking order. All other z-index values use the CSS variables in
 * zIndexVariables.css.
 */

const UNIT_BASE_Z_INDEX = 53;

/** Higher priority renders above lower. */
const UNIT_PRIORITIES: Record<string, number> = {
  THUNDERS_EDGE: 53,
  FF: 110,
  MF: 120,
  // Ground forces render above mech artwork.
  GF: 125,
  SD: 130,
  PD: 140,
  DD: 150,
  CV: 160,
  CA: 170,
  DN: 180,
  FS: 190,
  WS: 200,
};

export function getUnitZIndex(
  unitType: string | null | undefined,
  stackIndex: number = 0
): number {
  const priority = unitType ? UNIT_PRIORITIES[unitType.toUpperCase()] : 0;
  return (priority || UNIT_BASE_Z_INDEX) + stackIndex;
}
