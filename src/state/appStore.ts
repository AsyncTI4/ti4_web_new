import { create } from "zustand";
import { isMobileDevice } from "@/utils/isTouchDevice";
import {
  loadStoredChoice,
  mergeStoredSettings,
  readStoredObject,
  saveJsonSettings,
  saveStoredChoice,
} from "@/utils/localStorageSettings";
import {
  getMapViewPreference,
  setMapViewPreference,
  type MapViewPreference,
} from "@/utils/mapViewPreference";
import type { ControlTokenDisplayMode } from "@/entities/game/controlTokenDisplay";

const STORAGE_KEY = "ti4_settings";
const THEME_STORAGE_KEY = "ti4_theme";

export const THEME_NAMES = [
  "midnightbluetheme",
  "midnighttheme",
  "midnightgraytheme",
  "midnightredtheme",
  "sunsettheme",
  "magmatheme",
  "vaporwavetheme",
  "midnightviolettheme",
  "midnightgreentheme",
] as const;

type ThemeName = (typeof THEME_NAMES)[number];

const DEFAULT_THEME: ThemeName = "midnightgraytheme";

/** Removed themes and the theme a stored value migrates to. */
const DEPRECATED_THEMES: Record<string, ThemeName> = {
  bluetheme: "midnightbluetheme",
  slatetheme: "midnightgraytheme",
};

const CONTROL_TOKEN_DISPLAY_MODES: ControlTokenDisplayMode[] = [
  "always",
  "ambiguous",
  "empty",
];
const DEFAULT_SETTINGS: Settings = {
  isFirefox: false,
  settingsModalOpened: false,
  keyboardShortcutsModalOpened: false,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  overlaysEnabled: false,
  planetTypesMode: false,
  techSkipsMode: false,
  attachmentsMode: false,
  showPDSLayer: false,
  showControlLayer: false,
  controlTokenDisplayMode: "ambiguous",
  showExhaustedPlanets: true,
  animateEventPreviews: true,
  themeName: DEFAULT_THEME,
  accessibleColors: false,
  mapViewPreference: null,
  showPlayerAreaCommandTokens: true,
  showPlayerAreaArmyStrength: true,
  showPlayerAreaUnitUpgrades: true,
  showPlayerAreaTotalSpend: true,
  showPlayerAreaReinforcements: true,
  showPlayerAreaFactionAbilities: true,
  showPlayerAreaNeighborship: true,
};

/** Legacy settings stored a boolean `showControlTokens` instead of the mode. */
function resolveControlTokenDisplayMode(
  stored: Record<string, unknown> | null,
): ControlTokenDisplayMode {
  const storedMode = CONTROL_TOKEN_DISPLAY_MODES.find(
    (mode) => mode === stored?.controlTokenDisplayMode,
  );
  if (storedMode) return storedMode;
  if (typeof stored?.showControlTokens !== "boolean") return "ambiguous";
  return stored.showControlTokens ? "always" : "empty";
}

function loadSettingsFromStorage(): Settings {
  const stored = readStoredObject(STORAGE_KEY);
  return {
    ...mergeStoredSettings(stored, DEFAULT_SETTINGS),
    controlTokenDisplayMode: resolveControlTokenDisplayMode(stored),
  };
}

function saveSettingsToStorage(settings: Settings) {
  saveJsonSettings<Settings>(STORAGE_KEY, settings);
}

function loadThemeFromStorage(): ThemeName {
  const deprecated = loadStoredChoice(
    THEME_STORAGE_KEY,
    Object.keys(DEPRECATED_THEMES),
  );
  if (deprecated) {
    const migrated = DEPRECATED_THEMES[deprecated];
    saveThemeToStorage(migrated);
    return migrated;
  }
  return loadStoredChoice(THEME_STORAGE_KEY, THEME_NAMES) ?? DEFAULT_THEME;
}

function saveThemeToStorage(themeName: Settings["themeName"]) {
  saveStoredChoice(THEME_STORAGE_KEY, themeName, "theme");
}

const defaultZoomIndex = 2;
const zoomLevels = [
  0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.85, 0.9, 1, 1.2, 1.4, 1.6, 1.8, 2,
];

function getInitialZoomIndex() {
  const savedZoomIndex = localStorage.getItem("zoomIndex");
  if (savedZoomIndex !== null) {
    return parseInt(savedZoomIndex, 10);
  }
  return isMobileDevice() ? 0 : defaultZoomIndex;
}

type AppStore = {
  hoveredPlanetId: string | null;
  scrollToPlanetId: string | null;
  zoomLevel: number;
  zoomFitToScreen: boolean;
  setHoveredPlanetId: (planetId: string | null) => void;
  setScrollToPlanetId: (planetId: string | null) => void;

  /** The system whose dossier modal is open, or null when closed. */
  systemDossier: { position: string; systemId: string } | null;
  openSystemDossier: (position: string, systemId: string) => void;
  closeSystemDossier: () => void;

  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
  /** Snaps zoom to the largest ladder step that fits `contentWidth` into `viewportWidth`. */
  handleZoomFitToWidth: (contentWidth: number, viewportWidth: number) => number;
  handleZoomScreenSize: () => void;
};

export const useAppStore = create<AppStore>((set) => {
  let zoomIndex = getInitialZoomIndex();
  let zoomFitToScreen = localStorage.getItem("zoomFitToScreen") === "true";

  const changeZoomFitToScreen = (val: boolean) => {
    zoomFitToScreen = val;
    localStorage.setItem("zoomFitToScreen", val.toString());
  };

  const applyZoomIndex = (index: number) => {
    zoomIndex = index;
    localStorage.setItem("zoomIndex", index.toString());
    changeZoomFitToScreen(false);
    set({ zoomLevel: zoomLevels[index], zoomFitToScreen: false });
  };

  return {
    hoveredPlanetId: null,
    scrollToPlanetId: null,
    zoomLevel: zoomLevels[zoomIndex],
    zoomFitToScreen,

    systemDossier: null,
    openSystemDossier: (position: string, systemId: string) =>
      set({ systemDossier: { position, systemId } }),
    closeSystemDossier: () => set({ systemDossier: null }),

    setHoveredPlanetId: (planetId: string | null) =>
      set({ hoveredPlanetId: planetId }),
    setScrollToPlanetId: (planetId: string | null) =>
      set({ scrollToPlanetId: planetId }),

    handleZoomIn: () =>
      applyZoomIndex(Math.min(zoomIndex + 1, zoomLevels.length - 1)),
    handleZoomOut: () => applyZoomIndex(Math.max(zoomIndex - 1, 0)),
    handleZoomReset: () =>
      applyZoomIndex(isMobileDevice() ? 0 : defaultZoomIndex),
    /*
     * Largest ladder step whose scaled content still fits the given width.
     *
     * Snapped to the ladder rather than taking the raw ratio: zoom in/out step by
     * index, so an off-ladder value would make the next press jump to whatever
     * index happened to be current. Distinct from handleZoomScreenSize, which is
     * a persisted boolean the legacy image view reads and which computes nothing.
     */
    handleZoomFitToWidth: (contentWidth: number, viewportWidth: number) => {
      if (contentWidth <= 0 || viewportWidth <= 0) return zoomLevels[zoomIndex];
      const target = viewportWidth / contentWidth;
      let fitIndex = 0;
      for (let i = 0; i < zoomLevels.length; i++) {
        if (zoomLevels[i] <= target) fitIndex = i;
      }
      applyZoomIndex(fitIndex);
      return zoomLevels[fitIndex];
    },
    handleZoomScreenSize: () => {
      changeZoomFitToScreen(!zoomFitToScreen);
      set({ zoomFitToScreen });
    },
  };
});

export type Settings = {
  isFirefox: boolean;
  settingsModalOpened: boolean;
  keyboardShortcutsModalOpened: boolean;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  overlaysEnabled: boolean;
  planetTypesMode: boolean;
  techSkipsMode: boolean;
  attachmentsMode: boolean;
  showPDSLayer: boolean;
  showControlLayer: boolean;
  controlTokenDisplayMode: ControlTokenDisplayMode;
  showExhaustedPlanets: boolean;
  animateEventPreviews: boolean;
  themeName: ThemeName;
  accessibleColors: boolean;
  mapViewPreference: MapViewPreference | null;
  showPlayerAreaCommandTokens: boolean;
  showPlayerAreaArmyStrength: boolean;
  showPlayerAreaUnitUpgrades: boolean;
  showPlayerAreaTotalSpend: boolean;
  showPlayerAreaReinforcements: boolean;
  showPlayerAreaFactionAbilities: boolean;
  showPlayerAreaNeighborship: boolean;
};

type BooleanSettingKey = {
  [K in keyof Settings]: Settings[K] extends boolean ? K : never;
}[keyof Settings];

type SettingsHandlers = {
  updateSettings: (updates: Partial<Settings>) => void;
  setSettingsModalOpened: (opened: boolean) => void;
  setKeyboardShortcutsModalOpened: (opened: boolean) => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  toggleOverlays: () => void;
  togglePlanetTypesMode: () => void;
  toggleTechSkipsMode: () => void;
  toggleAttachmentsMode: () => void;
  togglePdsMode: () => void;
  toggleShowControlLayer: () => void;
  toggleShowExhaustedPlanets: () => void;
  setThemeName: (name: Settings["themeName"]) => void;
  toggleAccessibleColors: () => void;
  setMapViewPreference: (preference: MapViewPreference) => void;
};

export type SettingsStore = {
  settings: Settings;
  handlers: SettingsHandlers;
  updateSettings: (updates: Partial<Settings>) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => {
  const persist = (getUpdates: (current: Settings) => Partial<Settings>) =>
    set((state) => {
      const settings = { ...state.settings, ...getUpdates(state.settings) };
      saveSettingsToStorage(settings);
      return { settings };
    });

  const updateSettings = (updates: Partial<Settings>) => persist(() => updates);

  const toggle = (key: BooleanSettingKey) => () =>
    persist((current) => ({ [key]: !current[key] }));

  return {
    settings: {
      ...loadSettingsFromStorage(),
      isFirefox:
        typeof navigator !== "undefined" &&
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
      themeName: loadThemeFromStorage(),
      mapViewPreference: getMapViewPreference(),
    },

    handlers: {
      updateSettings,
      setSettingsModalOpened: (opened) =>
        updateSettings({ settingsModalOpened: opened }),
      setKeyboardShortcutsModalOpened: (opened) =>
        updateSettings({ keyboardShortcutsModalOpened: opened }),
      toggleLeftPanelCollapsed: toggle("leftPanelCollapsed"),
      toggleRightPanelCollapsed: toggle("rightPanelCollapsed"),
      toggleOverlays: toggle("overlaysEnabled"),
      togglePlanetTypesMode: toggle("planetTypesMode"),
      toggleTechSkipsMode: toggle("techSkipsMode"),
      toggleAttachmentsMode: toggle("attachmentsMode"),
      togglePdsMode: toggle("showPDSLayer"),
      toggleShowControlLayer: toggle("showControlLayer"),
      toggleShowExhaustedPlanets: toggle("showExhaustedPlanets"),
      setThemeName: (name) => {
        saveThemeToStorage(name);
        set((state) => ({ settings: { ...state.settings, themeName: name } }));
      },
      toggleAccessibleColors: toggle("accessibleColors"),
      setMapViewPreference: (preference) => {
        setMapViewPreference(preference);
        updateSettings({ mapViewPreference: preference });
      },
    },

    updateSettings,
  };
});
