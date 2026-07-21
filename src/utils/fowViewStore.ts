import { create } from "zustand";

type FowViewStore = {
  /** GM-only debug override: discord ID (or faction) of the player whose fogged view to preview. */
  viewAsPlayerId: string | null;
  setViewAsPlayer: (idOrFaction: string | null) => void;
};

export const useFowViewStore = create<FowViewStore>((set) => ({
  viewAsPlayerId: null,
  setViewAsPlayer: (idOrFaction) => set({ viewAsPlayerId: idOrFaction }),
}));
