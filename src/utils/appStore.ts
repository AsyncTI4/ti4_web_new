import { create } from "zustand";

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
  techSkipsMode: false,
  showPDSLayer: false,
  distanceMode: false,
  showControlLayer: false,
  showControlTokens: true,
  showExhaustedPlanets: true,
  themeName: "midnightbluetheme" as const,
  accessibleColors: false,
};

export function loadSettingsFromStorage(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

function loadThemeFromStorage(): Settings["themeName"] {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    const validThemes = new Set<Settings["themeName"]>([
      "bluetheme",
      "midnightbluetheme",
      "midnighttheme",
      "midnightgraytheme",
      "midnightredtheme",
      "sunsettheme",
      "magmatheme",
      "vaporwavetheme",
      "midnightviolettheme",
      "midnightgreentheme",
      "slatetheme",
    ] as const);
    if (raw && validThemes.has(raw as Settings["themeName"])) {
      return raw as Settings["themeName"];
    }
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
  }
  return "midnightbluetheme";
}

function saveThemeToStorage(themeName: Settings["themeName"]) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
}

type AppStore = {
  hoveredTile: string;
  zoomLevel: number;
  tooltipUnit: TooltipUnit | null;
  tooltipPlanet: TooltipPlanet | null;
  selectedArea: string | null;
  activeArea: string | null;
  selectedFacion: string | null;
  activeUnit: string | null;
  setSelectedArea: (area: string) => void;
  setActiveArea: (area: string) => void;
  setSelectedFaction: (faction: string) => void;
  setActiveUnit: (unit: string) => void;
  setTooltipUnit: (unit: TooltipUnit | null) => void;
  setTooltipPlanet: (planet: TooltipPlanet | null) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  hoveredTile: "",
  zoomLevel: 100,
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
}));

export type Settings = {
  isFirefox: boolean;
  settingsModalOpened: boolean;
  keyboardShortcutsModalOpened: boolean;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  overlaysEnabled: boolean;
  techSkipsMode: boolean;
  showPDSLayer: boolean;
  distanceMode: boolean;
  showControlLayer: boolean;
  showControlTokens: boolean;
  showExhaustedPlanets: boolean;
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
};

type SettingsHandlers = {
  updateSettings: (updates: Partial<Settings>) => void;
  setSettingsModalOpened: (opened: boolean) => void;
  setKeyboardShortcutsModalOpened: (opened: boolean) => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  toggleOverlays: () => void;
  toggleTechSkipsMode: () => void;
  togglePdsMode: () => void;
  toggleDistanceMode: () => void;
  toggleShowControlLayer: () => void;
  toggleAlwaysShowControlTokens: () => void;
  toggleShowExhaustedPlanets: () => void;
  setThemeName: (name: Settings["themeName"]) => void;
  toggleAccessibleColors: () => void;
};

type SettingsStore = {
  settings: Settings;
  handlers: SettingsHandlers;

  updateSettings: (updates: Partial<Settings>) => void;
  setSettingsModalOpened: (opened: boolean) => void;
  setKeyboardShortcutsModalOpened: (opened: boolean) => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  toggleOverlays: () => void;
  toggleTechSkipsMode: () => void;
  toggleShowPDSLayer: () => void;
  toggleDistanceMode: () => void;
  toggleShowControlLayer: () => void;
  toggleAlwaysShowControlTokens: () => void;
  toggleShowExhaustedPlanets: () => void;
  setThemeName: (name: Settings["themeName"]) => void;
  toggleAccessibleColors: () => void;
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

  const toggleTechSkipsMode = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        techSkipsMode: !state.settings.techSkipsMode,
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

  const toggleDistanceMode = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        distanceMode: !state.settings.distanceMode,
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

  const toggleAlwaysShowControlTokens = () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        showControlTokens: !state.settings.showControlTokens,
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

  return {
    settings: {
      ...loadSettingsFromStorage(),
      isFirefox:
        typeof navigator !== "undefined" &&
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
      themeName: loadThemeFromStorage(),
    },

    handlers: {
      updateSettings,
      setSettingsModalOpened,
      setKeyboardShortcutsModalOpened,
      toggleLeftPanelCollapsed,
      toggleRightPanelCollapsed,
      toggleOverlays,
      toggleTechSkipsMode,
      togglePdsMode: toggleShowPDSLayer,
      toggleDistanceMode,
      toggleShowControlLayer,
      toggleAlwaysShowControlTokens,
      toggleShowExhaustedPlanets,
      setThemeName,
      toggleAccessibleColors,
    },

    // Keep the individual handlers for backwards compatibility
    updateSettings,
    setSettingsModalOpened,
    setKeyboardShortcutsModalOpened,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
    toggleOverlays,
    toggleTechSkipsMode,
    toggleShowPDSLayer,
    toggleDistanceMode,
    toggleShowControlLayer,
    toggleAlwaysShowControlTokens,
    toggleShowExhaustedPlanets,
    setThemeName,
    toggleAccessibleColors,
  };
});
