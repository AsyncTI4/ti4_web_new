import { createContext, useContext } from "react";

export type SheetUnit = { unitId: string; color?: string };

/**
 * Set when the dossier shows unit stat cards itself, as a sheet over its own
 * surface, rather than letting each unit float a popover. A phone needs this:
 * a popover is placed against the layout viewport, which a pinched or
 * shrunk-to-fit page does not show all of, so the card lands off screen.
 */
export const UnitSheetContext = createContext<
  ((unit: SheetUnit) => void) | null
>(null);

export function useUnitSheet() {
  return useContext(UnitSheetContext);
}
