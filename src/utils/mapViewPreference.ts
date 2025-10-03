const MAP_VIEW_PREFERENCE_KEY = "ti4_map_view_preference_4";

export type MapViewPreference = "panels" | "pannable";

export function getMapViewPreference(): MapViewPreference | null {
  try {
    const stored = localStorage.getItem(MAP_VIEW_PREFERENCE_KEY);
    if (stored === "panels" || stored === "pannable") {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

export function setMapViewPreference(preference: MapViewPreference): void {
  try {
    localStorage.setItem(MAP_VIEW_PREFERENCE_KEY, preference);
  } catch (error) {
    console.warn("Failed to save map view preference:", error);
  }
}
