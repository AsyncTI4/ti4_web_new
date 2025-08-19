import { create } from "zustand";

export type UnitCounts = { healthy: number; sustained: number };
export type AreaUnits = {
  [faction: string]: { [unitType: string]: UnitCounts };
};
export type OriginDraft = {
  space: AreaUnits;
  planets: { [planetName: string]: AreaUnits };
};

export type DisplacementDraft = {
  targetPositionId: string | null;
  origins: { [position: string]: OriginDraft };
};

type MovementStore = {
  draft: DisplacementDraft;
  setTargetPositionId: (positionId: string | null) => void;
  setCounts: (
    position: string,
    area: { type: "space" } | { type: "planet"; name: string },
    faction: string,
    unitType: string,
    counts: UnitCounts
  ) => void;
  clearOrigin: (position: string) => void;
  clearAll: () => void;
};

const ensureOrigin = (
  origins: DisplacementDraft["origins"],
  position: string
): OriginDraft => {
  return (origins[position] ||= { space: {}, planets: {} });
};

const setAreaUnitCounts = (
  origin: OriginDraft,
  area: { type: "space" } | { type: "planet"; name: string },
  faction: string,
  unitType: string,
  counts: UnitCounts
) => {
  const targetArea: AreaUnits =
    area.type === "space" ? origin.space : (origin.planets[area.name] ||= {});

  const byFaction = (targetArea[faction] ||= {});
  if (counts.healthy <= 0 && counts.sustained <= 0) {
    if (byFaction[unitType]) delete byFaction[unitType];
    if (Object.keys(byFaction).length === 0) delete targetArea[faction];
    return;
  }
  byFaction[unitType] = {
    healthy: counts.healthy,
    sustained: counts.sustained,
  };
};

export const useMovementStore = create<MovementStore>((set) => ({
  draft: { targetPositionId: null, origins: {} },

  setTargetPositionId: (positionId) =>
    set((state) => ({
      ...state,
      draft: { ...state.draft, targetPositionId: positionId },
    })),

  setCounts: (position, area, faction, unitType, counts) =>
    set((state) => {
      const next = { ...state.draft, origins: { ...state.draft.origins } };
      const origin = ensureOrigin(next.origins, position);
      // Ensure nested objects are copied before mutation
      const originCopy: OriginDraft = {
        space: { ...origin.space },
        planets: Object.fromEntries(
          Object.entries(origin.planets).map(([k, v]) => [k, { ...v }])
        ),
      };
      next.origins[position] = originCopy;
      setAreaUnitCounts(originCopy, area, faction, unitType, counts);
      return { ...state, draft: next };
    }),

  clearOrigin: (position) =>
    set((state) => {
      const next = { ...state.draft, origins: { ...state.draft.origins } };
      delete next.origins[position];
      return { ...state, draft: next };
    }),

  clearAll: () =>
    set(() => ({ draft: { targetPositionId: null, origins: {} } })),
}));
