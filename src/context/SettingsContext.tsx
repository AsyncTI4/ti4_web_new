import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type Settings = {
  overlaysEnabled: boolean;
  alwaysShowControlTokens: boolean;
  techSkipsMode: boolean;
  planetTypesMode: boolean;
  distanceMode: boolean;
  pdsMode: boolean;
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;
  showExhaustedPlanets: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  overlaysEnabled: false,
  alwaysShowControlTokens: true,
  techSkipsMode: false,
  planetTypesMode: false,
  distanceMode: false,
  pdsMode: false,
  isLeftPanelCollapsed: false,
  isRightPanelCollapsed: false,
  showExhaustedPlanets: true,
};

const STORAGE_KEY = "ti4_settings";

function loadSettingsFromStorage(): Settings {
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

function saveSettingsToStorage(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleOverlays: () => void;
  toggleAlwaysShowControlTokens: () => void;
  toggleTechSkipsMode: () => void;
  togglePlanetTypesMode: () => void;
  toggleDistanceMode: () => void;
  togglePdsMode: () => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  toggleShowExhaustedPlanets: () => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

type SettingsProviderProps = {
  children: ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(loadSettingsFromStorage);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleOverlays = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, overlaysEnabled: !prev.overlaysEnabled };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleAlwaysShowControlTokens = useCallback(() => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        alwaysShowControlTokens: !prev.alwaysShowControlTokens,
      };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleTechSkipsMode = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, techSkipsMode: !prev.techSkipsMode };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const togglePlanetTypesMode = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, planetTypesMode: !prev.planetTypesMode };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleDistanceMode = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, distanceMode: !prev.distanceMode };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const togglePdsMode = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, pdsMode: !prev.pdsMode };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleLeftPanelCollapsed = useCallback(() => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        isLeftPanelCollapsed: !prev.isLeftPanelCollapsed,
      };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleRightPanelCollapsed = useCallback(() => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        isRightPanelCollapsed: !prev.isRightPanelCollapsed,
      };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleShowExhaustedPlanets = useCallback(() => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        showExhaustedPlanets: !prev.showExhaustedPlanets,
      };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    toggleOverlays,
    toggleAlwaysShowControlTokens,
    toggleTechSkipsMode,
    togglePlanetTypesMode,
    toggleDistanceMode,
    togglePdsMode,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
    toggleShowExhaustedPlanets,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
