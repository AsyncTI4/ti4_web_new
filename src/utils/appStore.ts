import { create } from "zustand";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { loadJsonSettings, saveJsonSettings } from "@/utils/localStorageSettings";
import {
  getMapViewPreference,
  setMapViewPreference,
  type MapViewPreference,
} from "@/utils/mapViewPreference";
import type { ControlTokenDisplayMode } from "@/utils/controlTokenDisplay";

export type TooltipUnit = {
  unitId?: string;
  faction: string;
  coords: { x: number; y: number };
};

export type TooltipPlanet = {
  systemId: string;
  planetId: string;
  coords: { x: number; y: number };
};

const STORAGE_KEY = "ti4_settings";
const THEME_STORAGE_KEY = "ti4_theme";
const DEFAULT_SETTINGS = {
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
  controlTokenDisplayMode: "ambiguous" as ControlTokenDisplayMode,
  showExhaustedPlanets: true,
  animateEventPreviews: true,
  themeName: "midnightgraytheme" as const,
  accessibleColors: false,
  mapViewPreference: null as MapViewPreference | null,
  showPlayerAreaCommandTokens: true,
  showPlayerAreaArmyStrength: true,
  showPlayerAreaUnitUpgrades: true,
  showPlayerAreaTotalSpend: true,
  showPlayerAreaReinforcements: true,
  showPlayerAreaFactionAbilities: true,
  showPlayerAreaNeighborship: true,
};

export function loadSettingsFromStorage(): Settings {
  const settings = loadJsonSettings<Settings>(STORAGE_KEY, DEFAULT_SETTINGS);

  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    ) as Record<string, unknown> | null;
    const storedMode = stored?.controlTokenDisplayMode;
    if (
      storedMode === "always" ||
      storedMode === "ambiguous" ||
      storedMode === "empty"
    ) {
      settings.controlTokenDisplayMode = storedMode;
    } else if (typeof stored?.showControlTokens === "boolean") {
      settings.controlTokenDisplayMode = stored.showControlTokens
        ? "always"
        : "empty";
    } else {
      settings.controlTokenDisplayMode = "ambiguous";
    }
  } catch {
    // loadJsonSettings already reports malformed stored settings.
  }

  return settings;
}

export function saveSettingsToStorage(settings: Settings) {
  saveJsonSettings<Settings>(STORAGE_KEY, settings);
}

function loadThemeFromStorage(): Settings["themeName"] {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);

    // Migration: Replace deprecated themes with their replacements
    // 'bluetheme' -> 'midnightbluetheme' (deprecated, removed)
    // 'slatetheme' -> 'midnightgraytheme' (deprecated, removed)
    if (raw === "bluetheme") {
      const migrated = "midnightbluetheme";
      localStorage.setItem(THEME_STORAGE_KEY, migrated);
      return migrated;
    }
    if (raw === "slatetheme") {
      const migrated = "midnightgraytheme";
      localStorage.setItem(THEME_STORAGE_KEY, migrated);
      return migrated;
    }

    const validThemes = new Set<Settings["themeName"]>([
      "midnightbluetheme",
      "midnighttheme",
      "midnightgraytheme",
      "midnightredtheme",
      "sunsettheme",
      "magmatheme",
      "vaporwavetheme",
      "midnightviolettheme",
      "midnightgreentheme",
    ] as const);
    if (raw && validThemes.has(raw as Settings["themeName"])) {
      return raw as Settings["themeName"];
    }
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
  }
  return "midnightgraytheme";
}

function saveThemeToStorage(themeName: Settings["themeName"]) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
}

// Zoom configuration from ScrollMap
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
  hoveredTile: string;
  hoveredPlanetId: string | null;
  scrollToPlanetId: string | null;
  zoomLevel: number;
  overlayZoom: number;
  zoomFitToScreen: boolean;
  tooltipUnit: TooltipUnit | null;
  tooltipPlanet: TooltipPlanet | null;
  selectedArea: string | null;
  activeArea: string | null;
  selectedFacion: string | null;
  activeUnit: string | null;
  setZoomLevel: (level: number) => void;
  setSelectedArea: (area: string) => void;
  setActiveArea: (area: string) => void;
  setSelectedFaction: (faction: string) => void;
  setActiveUnit: (unit: string) => void;
  setTooltipUnit: (unit: TooltipUnit | null) => void;
  setTooltipPlanet: (planet: TooltipPlanet | null) => void;
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

/*
keeping this here from original zoom hook, but with it's use in the Map,
neither imageNaturalWidth nor containerWidth was populated.
it would always evaluate as 1, so     overlayZoom: zoomFitToScreen ? 1 : zoom
in the return statement was changed to be as such.

const overlayZoom = (imageNaturalWidth: number | undefined, containerWidth: number | undefined) => {
  return imageNaturalWidth && containerWidth
    ? containerWidth / imageNaturalWidth
    : 1;
  }
    */

export const useAppStore = create<AppStore>((set) => {
  let zoomIndex = getInitialZoomIndex();
  let zoomFitToScreen = localStorage.getItem("zoomFitToScreen") === "true";

  const zoom = zoomLevels[zoomIndex];

  const changeZoomIndex = (val: number) => {
    zoomIndex = val;
    localStorage.setItem("zoomIndex", val.toString());
  };

  const changeZoomFitToScreen = (val: boolean) => {
    zoomFitToScreen = val;
    localStorage.setItem("zoomFitToScreen", val.toString());
  };

  return {
    hoveredTile: "",
    hoveredPlanetId: null,
    scrollToPlanetId: null,
    zoomLevel: zoom,
    overlayZoom: zoomFitToScreen ? 1 : zoom,
    zoomFitToScreen,
    selectedArea: "",
    activeArea: "",
    selectedFacion: "",
    activeUnit: "",
    tooltipUnit: {
      faction: "",
      coords: {
        x: 0,
        y: 0,
      },
    },
    tooltipPlanet: {
      systemId: "",
      planetId: "",
      coords: { x: 0, y: 0 },
    },

    systemDossier: null,
    openSystemDossier: (position: string, systemId: string) =>
      set((state) => ({
        ...state,
        systemDossier: { position, systemId },
      })),
    closeSystemDossier: () =>
      set((state) => ({
        ...state,
        systemDossier: null,
      })),

    setHoveredTile: (id: string) =>
      set((state) => ({
        ...state,
        hoveredTile: id,
      })),
    clearHoveredTile: () =>
      set((state) => ({
        ...state,
        hoveredTile: "",
      })),
    setZoomLevel: (level: number) =>
      set((state) => ({
        ...state,
        zoomLevel: level,
      })),
    setSelectedArea: (area: string) =>
      set((state) => ({
        ...state,
        selectedArea: area,
      })),
    setActiveArea: (area: string) =>
      set((state) => ({
        ...state,
        activeArea: area,
      })),
    setSelectedFaction: (faction: string) =>
      set((state) => ({
        ...state,
        selectedFacion: faction,
      })),
    setActiveUnit: (unit: string) =>
      set((state) => ({
        ...state,
        activeUnit: unit,
      })),
    setTooltipUnit: (unit: TooltipUnit | null) =>
      set((state) => ({
        ...state,
        tooltipUnit: unit,
      })),
    setTooltipPlanet: (planet: TooltipPlanet | null) =>
      set((state) => ({
        ...state,
        tooltipPlanet: planet,
      })),
    setHoveredPlanetId: (planetId: string | null) =>
      set((state) => ({
        ...state,
        hoveredPlanetId: planetId,
      })),
    setScrollToPlanetId: (planetId: string | null) =>
      set((state) => ({
        ...state,
        scrollToPlanetId: planetId,
      })),

    handleZoomIn: () => {
      const newIndex = Math.min(zoomIndex + 1, zoomLevels.length - 1);
      changeZoomIndex(newIndex);
      changeZoomFitToScreen(false);
      set((state) => ({
        ...state,
        zoomLevel: zoomLevels[newIndex],
        zoomFitToScreen: false,
      }));
      return newIndex;
    },
    handleZoomOut: () => {
      const newIndex = Math.max(zoomIndex - 1, 0);
      changeZoomIndex(newIndex);
      changeZoomFitToScreen(false);
      set((state) => ({
        ...state,
        zoomLevel: zoomLevels[newIndex],
        zoomFitToScreen: false,
      }));
      return newIndex;
    },
    handleZoomReset: () => {
      const resetIndex = isMobileDevice() ? 0 : defaultZoomIndex;
      changeZoomIndex(resetIndex);
      changeZoomFitToScreen(false);
      set((state) => ({
        ...state,
        zoomLevel: zoomLevels[resetIndex],
        zoomFitToScreen: false,
      }));
    },
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
      changeZoomIndex(fitIndex);
      changeZoomFitToScreen(false);
      set((state) => ({
        ...state,
        zoomLevel: zoomLevels[fitIndex],
        zoomFitToScreen: false,
      }));
      return zoomLevels[fitIndex];
    },
    handleZoomScreenSize: () => {
      changeZoomFitToScreen(!zoomFitToScreen);
      set((state) => ({
        ...state,
        zoomFitToScreen: !zoomFitToScreen,
      }));
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
  themeName:
    | "bluetheme"
    | "midnightbluetheme"
    | "midnighttheme"
    | "midnightgraytheme"
    | "midnightredtheme"
    | "sunsettheme"
    | "magmatheme"
    | "vaporwavetheme"
    | "midnightviolettheme"
    | "midnightgreentheme"
    | "slatetheme";
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
  setSettingsModalOpened: (opened: boolean) => void;
  setKeyboardShortcutsModalOpened: (opened: boolean) => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  toggleOverlays: () => void;
  togglePlanetTypesMode: () => void;
  toggleAttachmentsMode: () => void;
  toggleTechSkipsMode: () => void;
  toggleShowPDSLayer: () => void;
  toggleShowControlLayer: () => void;
  toggleShowExhaustedPlanets: () => void;
  setThemeName: (name: Settings["themeName"]) => void;
  toggleAccessibleColors: () => void;
  setMapViewPreference: (preference: MapViewPreference) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => {
  const updateSettings = (updates: Partial<Settings>) =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        ...updates,
      } as Settings;
      saveSettingsToStorage(newSettings);
      return {
        ...state,
        settings: newSettings,
      };
    });

  const setSettingsModalOpened = (opened: boolean) =>
    set((state) => {
      const newSettings = { ...state.settings, settingsModalOpened: opened };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const setKeyboardShortcutsModalOpened = (opened: boolean) =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        keyboardShortcutsModalOpened: opened,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleLeftPanelCollapsed = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        leftPanelCollapsed: !state.settings.leftPanelCollapsed,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleRightPanelCollapsed = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        rightPanelCollapsed: !state.settings.rightPanelCollapsed,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleOverlays = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        overlaysEnabled: !state.settings.overlaysEnabled,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const togglePlanetTypesMode = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        planetTypesMode: !state.settings.planetTypesMode,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleTechSkipsMode = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        techSkipsMode: !state.settings.techSkipsMode,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleAttachmentsMode = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        attachmentsMode: !state.settings.attachmentsMode,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleShowPDSLayer = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        showPDSLayer: !state.settings.showPDSLayer,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleShowControlLayer = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        showControlLayer: !state.settings.showControlLayer,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const toggleShowExhaustedPlanets = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        showExhaustedPlanets: !state.settings.showExhaustedPlanets,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const setThemeName = (name: Settings["themeName"]) =>
    set((state) => {
      const next = {
        ...state,
        settings: {
          ...state.settings,
          themeName: name,
        },
      };
      saveThemeToStorage(name);
      return next;
    });

  const toggleAccessibleColors = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        accessibleColors: !state.settings.accessibleColors,
      };
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

  const handleSetMapViewPreference = (preference: MapViewPreference) =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        mapViewPreference: preference,
      };
      setMapViewPreference(preference);
      saveSettingsToStorage(newSettings as Settings);
      return { ...state, settings: newSettings };
    });

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
      setSettingsModalOpened,
      setKeyboardShortcutsModalOpened,
      toggleLeftPanelCollapsed,
      toggleRightPanelCollapsed,
      toggleOverlays,
      togglePlanetTypesMode,
      toggleTechSkipsMode,
      toggleAttachmentsMode,
      togglePdsMode: toggleShowPDSLayer,
      toggleShowControlLayer,
      toggleShowExhaustedPlanets,
      setThemeName,
      toggleAccessibleColors,
      setMapViewPreference: handleSetMapViewPreference,
    },

    // Keep the individual handlers for backwards compatibility
    updateSettings,
    setSettingsModalOpened,
    setKeyboardShortcutsModalOpened,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
    toggleOverlays,
    togglePlanetTypesMode,
    toggleTechSkipsMode,
    toggleAttachmentsMode,
    toggleShowPDSLayer,
    toggleShowControlLayer,
    toggleShowExhaustedPlanets,
    setThemeName,
    toggleAccessibleColors,
    setMapViewPreference: handleSetMapViewPreference,
  };
});
