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
const DEFAULT_SETTINGS = {
  isFirefox: false,
  settingsModalOpened: false,
  keyboardShortcutsModalOpened: false,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  enableOverlays: false,
  techSkipsMode: false,
  showPDSLayer: false,
  distanceMode: false,
  showControlLayer: false,
  showControlTokens: true,
  showExhaustedPlanets: true,
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


type AppStore = {
  hoveredTile: string;
  zoomLevel: number;
  tooltipUnit: TooltipUnit | null;
  tooltipPlanet: TooltipPlanet | null;
  selectedArea: string | null;
  activeArea: string | null;
  selectedFacion: string | null;
  activeUnit: string | null;
  mapPadding: number;
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
  mapPadding: 200,

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
};

type SettingsStore = {
  settings: Settings;

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
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    isFirefox: typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
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
  },


  updateSettings: (updates: Partial<Settings>) =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        ...updates,
      },
    })),
  setSettingsModalOpened: (opened: boolean) =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        settingsModalOpened: opened,
      },
    })),
  setKeyboardShortcutsModalOpened: (opened: boolean) =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        keyboardShortcutsModalOpened: opened,
      },
    })),
  toggleLeftPanelCollapsed: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        leftPanelCollapsed: !state.settings.leftPanelCollapsed,
      },
    })),
  toggleRightPanelCollapsed: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        rightPanelCollapsed: !state.settings.rightPanelCollapsed,
      },
    })),
  toggleOverlays: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        overlaysEnabled: !state.settings.overlaysEnabled,
      },
    })),
  toggleTechSkipsMode: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        techSkipsMode: !state.settings.techSkipsMode,
      },
    })),
  toggleShowPDSLayer: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showPDSLayer: !state.settings.showPDSLayer,
      },
    })),
  toggleDistanceMode: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        distanceMode: !state.settings.distanceMode,
      },
    })),
  toggleShowControlLayer: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showControlLayer: !state.settings.showControlLayer,
      },
    })),
  toggleAlwaysShowControlTokens: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showControlTokens: !state.settings.showControlTokens,
      },
    })),
  toggleShowExhaustedPlanets: () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showExhaustedPlanets: !state.settings.showExhaustedPlanets,
      },
    })),
}));
