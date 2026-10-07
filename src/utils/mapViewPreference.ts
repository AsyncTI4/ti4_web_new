import { loadStoredChoice, saveStoredChoice } from "@/utils/localStorageSettings";

const MAP_VIEW_PREFERENCE_KEY = "ti4_map_view_preference_5";
const MAP_VIEW_PREFERENCES = ["panels", "pannable"] as const;

export type MapViewPreference = (typeof MAP_VIEW_PREFERENCES)[number];

export function getMapViewPreference(): MapViewPreference | null {
  return loadStoredChoice(MAP_VIEW_PREFERENCE_KEY, MAP_VIEW_PREFERENCES);
}

export function setMapViewPreference(preference: MapViewPreference): void {
  saveStoredChoice(MAP_VIEW_PREFERENCE_KEY, preference, "map view preference");
}
