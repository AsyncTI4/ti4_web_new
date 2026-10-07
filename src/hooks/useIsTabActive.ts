import { createContext, useContext } from "react";

/**
 * Whether the enclosing game tab is the one on screen. Tabs stay mounted after
 * their first visit, so document-level listeners inside a hidden tab use this
 * to stand down.
 */
export const TabActiveContext = createContext(true);

export function useIsTabActive() {
  return useContext(TabActiveContext);
}
