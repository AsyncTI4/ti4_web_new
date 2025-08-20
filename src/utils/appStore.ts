import { create } from "zustand";
import { isMobileDevice } from "@/utils/isTouchDevice";

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
  overlaysEnabled: false,
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
  zoomLevel: number;
  overlayZoom: number;
  zoomFitToScreen: boolean;
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

  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
  handleZoomScreenSize: () => void;
};

export const useAppStore = create<AppStore>((set) => {
  let zoomIndex = getInitialZoomIndex();
  let zoomFitToScreen = localStorage.getItem("zoomFitToScreen") === "true";

  const overlayZoom = (imageNaturalWidth: number | undefined, containerWidth: number | undefined) => {
    return imageNaturalWidth && containerWidth
      ? containerWidth / imageNaturalWidth
      : 1;
    }
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
    zoomLevel: 1,
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
  techSkipsMode: boolean;
  showPDSLayer: boolean;
  distanceMode: boolean;
  showControlLayer: boolean;
  showControlTokens: boolean;
  showExhaustedPlanets: boolean;
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
};

export const useSettingsStore = create<SettingsStore>((set) => {
  const updateSettings = (updates: Partial<Settings>) =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        ...updates,
      },
    }));

  const setSettingsModalOpened = (opened: boolean) =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        settingsModalOpened: opened,
      },
    }));

  const setKeyboardShortcutsModalOpened = (opened: boolean) =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        keyboardShortcutsModalOpened: opened,
      },
    }));

  const toggleLeftPanelCollapsed = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        leftPanelCollapsed: !state.settings.leftPanelCollapsed,
      },
    }));

  const toggleRightPanelCollapsed = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        rightPanelCollapsed: !state.settings.rightPanelCollapsed,
      },
    }));

  const toggleOverlays = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        overlaysEnabled: !state.settings.overlaysEnabled,
      },
    }));

  const toggleTechSkipsMode = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        techSkipsMode: !state.settings.techSkipsMode,
      },
    }));

  const toggleShowPDSLayer = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showPDSLayer: !state.settings.showPDSLayer,
      },
    }));

  const toggleDistanceMode = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        distanceMode: !state.settings.distanceMode,
      },
    }));

  const toggleShowControlLayer = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showControlLayer: !state.settings.showControlLayer,
      },
    }));

  const toggleAlwaysShowControlTokens = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showControlTokens: !state.settings.showControlTokens,
      },
    }));

  const toggleShowExhaustedPlanets = () =>
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        showExhaustedPlanets: !state.settings.showExhaustedPlanets,
      },
    }));

  return {
    settings: {
      isFirefox:
        typeof navigator !== "undefined" &&
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
  };
});
